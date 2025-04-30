import gleam/bool
import gleam/dict.{type Dict}
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import gleam/string
import models/item
import models/product
import server_response
import sqlight
import utils
import wisp

pub fn list(
  conn: sqlight.Connection,
  queries: List(#(String, String)),
) -> wisp.Response {
  let expired =
    list.find_map(queries, fn(query) {
      bool.guard(
        when: query.0 == "expired",
        return: Ok(query.1 == "true"),
        otherwise: fn() { Error(Nil) },
      )
    })
    |> option.from_result()

  let filters = case expired {
    option.Some(True) -> "Item.expires_at <= (unixepoch() * 1000)"
    option.Some(False) -> "Item.expires_at > (unixepoch() * 1000)"
    option.None -> ""
  }
  let query =
    "SELECT "
    <> item.full_columns()
    <> " FROM Item"
    <> case filters == "" {
      True -> ""
      False -> " WHERE " <> filters
    }
    <> case expired {
      option.Some(True) -> " ORDER BY expires_at DESC;"
      option.Some(False) -> " ORDER BY expires_at ASC;"
      option.None -> ";"
    }

  use items <-
    sqlight.query(query, conn, [], item.decode_sqlight())
    |> utils.sqlight_many

  let product_ids: Dict(String, Nil) =
    list.fold(items, dict.new(), fn(acc, item) {
      dict.insert(acc, item.product_barcode, Nil)
    })

  let query_products =
    "SELECT "
    <> product.full_columns()
    <> " FROM Product"
    <> " WHERE barcode IN ('"
    <> string.join(dict.keys(product_ids), "', '")
    <> "')"

  use products_query_result <-
    sqlight.query(query_products, conn, [], product.decode_sqlight())
    |> utils.sqlight_many

  let products =
    dict.map_values(product_ids, fn(barcode, _) {
      let assert Ok(product) =
        list.find(products_query_result, fn(product) {
          product.barcode == barcode
        })
        |> result.map_error(fn(_) {
          wisp.log_error("Failed to find product with barcode " <> barcode)
          Nil
        })
      product.json(product)
    })

  let response =
    json.object([
      #("items", json.array(items, item.json)),
      #("products", json.object(dict.to_list(products))),
    ])

  server_response.success_200("Success", response)
}

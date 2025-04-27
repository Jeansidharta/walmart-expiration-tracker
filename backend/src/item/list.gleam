import gleam/bool
import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import gleam/string
import models/item
import models/product
import server_response
import sqlight
import utils
import wisp

pub fn decode() {
  // Item
  use id <- decode.field(0, decode.int)
  use creation_date_item <- decode.field(1, decode.int)
  use product_barcode <- decode.field(2, decode.string)
  use location <- decode.field(3, decode.string)
  use expires_at <- decode.field(4, decode.int)
  use count <- decode.field(5, decode.int)

  // Product
  use barcode <- decode.field(6, decode.string)
  use creation_date_product <- decode.field(7, decode.int)
  use name <- decode.field(8, decode.optional(decode.string))
  use image <- decode.field(9, decode.string)
  decode.success(#(
    item.Item(
      id:,
      creation_date: creation_date_item,
      product_barcode:,
      location:,
      expires_at:,
      count:,
    ),
    product.Product(
      barcode:,
      creation_date: creation_date_product,
      name:,
      image:,
    ),
  ))
}

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
    <> ","
    <> product.full_columns()
    <> " FROM Item"
    <> " JOIN Product ON Product.barcode = Item.product_barcode"
    <> case filters == "" {
      True -> ""
      False -> " WHERE " <> filters
    }
    <> " ORDER BY expires_at DESC;"

  wisp.log_info(query)
  wisp.log_info(
    list.map(queries, fn(query) { query.0 <> "=" <> query.1 })
    |> string.join("&"),
  )

  use items <-
    sqlight.query(query, conn, [], decode())
    |> utils.sqlight_many

  let response =
    json.array(items, fn(item) {
      json.object([
        #("item", item.json(item.0)),
        #("product", product.json(item.1)),
      ])
    })

  server_response.success_200("Success", response)
}

import gleam/dict.{type Dict}
import gleam/dynamic/decode
import gleam/json
import gleam/option
import server_response
import sqlight
import utils
import wisp

pub fn list(
  conn: sqlight.Connection,
  queries: Dict(String, String),
) -> wisp.Response {
  use expired <- utils.extract_param_bool(queries, "expired", fn() {
    server_response.error("Query param \"expired\" must be a valid boolean")
  })

  let expired_query = case expired {
    option.Some(True) -> " ORDER BY expires_at DESC"
    option.Some(False) -> " ORDER BY expires_at ASC"
    option.None -> ""
  }

  use pagination_query <- utils.query_params_sqlite(queries)

  let filters_query = case expired {
    option.Some(True) -> " WHERE Expiration.expires_at <= (unixepoch() * 1000)"
    option.Some(False) -> " WHERE Expiration.expires_at > (unixepoch() * 1000)"
    option.None -> ""
  }

  use expirations <-
    sqlight.query("
SELECT
  Expiration.creation_date, Expiration.expires_at, Expiration.id, Expiration.product_location_id,
  ProductLocation.location,
  Product.creation_date, Product.barcode, Product.name
FROM Expiration
JOIN ProductLocation ON ProductLocation.id = Expiration.product_location_id
JOIN Product ON ProductLocation.product_barcode = Product.barcode
" <> filters_query <> expired_query <> pagination_query, conn, [], {
      use exp_creation_date <- decode.field(0, decode.int)
      use exp_expires_at <- decode.field(1, decode.int)
      use exp_id <- decode.field(2, decode.int)
      use product_location_id <- decode.field(3, decode.int)
      use location <- decode.field(4, decode.string)
      use product_creation_date <- decode.field(5, decode.int)
      use barcode <- decode.field(6, decode.string)
      use name <- decode.field(7, decode.optional(decode.string))
      decode.success(#(
        exp_creation_date,
        exp_expires_at,
        exp_id,
        product_location_id,
        location,
        product_creation_date,
        barcode,
        name,
      ))
    })
    |> utils.sqlight_many

  use total_items <-
    sqlight.query(
      "SELECT COUNT(*) as 'count' FROM Expiration"
        <> filters_query
        <> expired_query,
      conn,
      [],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> utils.unwrap_error()

  server_response.success_200(
    "Success",
    json.object([
      #(
        "expirations",
        json.array(expirations, fn(expiration) {
          let #(
            exp_creation_date,
            exp_expires_at,
            exp_id,
            product_location_id,
            location,
            product_creation_date,
            barcode,
            name,
          ) = expiration
          json.object([
            #(
              "expiration",
              json.object([
                #("creation_date", json.int(exp_creation_date)),
                #("product_location_id", json.int(product_location_id)),
                #("expires_at", json.int(exp_expires_at)),
                #("id", json.int(exp_id)),
              ]),
            ),
            #("location", json.string(location)),
            #(
              "product",
              json.object([
                #("barcode", json.string(barcode)),
                #("creation_date", json.int(product_creation_date)),
                #("name", json.nullable(name, json.string)),
              ]),
            ),
          ])
        }),
      ),
      #("total_items", json.int(total_items)),
    ]),
  )
}

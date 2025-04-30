import gleam/dict
import gleam/dynamic/decode
import gleam/json
import models/product
import server_response
import sqlight
import utils
import wisp

pub fn list(
  conn: sqlight.Connection,
  queries: dict.Dict(String, String),
) -> wisp.Response {
  use pagination <- utils.query_params_extract_pagination(queries)
  let sql = "SELECT " <> product.full_columns() <> " FROM Product" <> pagination

  use product <-
    sqlight.query(sql, conn, [], product.decode_sqlight())
    |> utils.sqlight_many

  use total_items <-
    sqlight.query("SELECT COUNT(*) as count FROM Product", conn, [], {
      use count <- decode.field(0, decode.int)
      decode.success(count)
    })
    |> utils.sqlight_expect_one

  let response =
    json.object([
      #("products", json.array(product, product.json)),
      #("total_items", json.int(total_items)),
    ])

  server_response.success_200("Success", response)
}

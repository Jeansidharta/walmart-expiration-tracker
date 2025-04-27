import gleam/json
import models/product
import server_response
import sqlight
import utils
import wisp

pub fn list(conn: sqlight.Connection) -> wisp.Response {
  let sql = "SELECT " <> product.full_columns() <> " FROM Product;"

  use product <-
    sqlight.query(sql, conn, [], product.decode_sqlight())
    |> utils.sqlight_many

  let response = json.array(product, product.json)

  server_response.success_200("Success", response)
}

import gleam/json
import models/expiration
import sqlight
import utils
import wisp

pub fn get(id: Int, conn: sqlight.Connection) -> wisp.Response {
  use item <-
    sqlight.query(
      "SELECT " <> expiration.full_columns() <> " FROM item WHERE id = ?;",
      conn,
      [sqlight.int(id)],
      expiration.decode_sqlight(),
    )
    |> utils.sqlight_many

  let response =
    json.array(item, expiration.json)
    |> json.to_string_tree

  wisp.response(201)
  |> wisp.json_body(response)
}

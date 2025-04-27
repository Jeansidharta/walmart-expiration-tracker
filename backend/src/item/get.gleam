import gleam/json
import models/item
import sqlight
import utils
import wisp

pub fn get(id: Int, conn: sqlight.Connection) -> wisp.Response {
  use item <-
    sqlight.query(
      "SELECT " <> item.full_columns() <> " FROM item WHERE id = ?;",
      conn,
      [sqlight.int(id)],
      item.decode_sqlight(),
    )
    |> utils.sqlight_many

  let response =
    json.array(item, item.json)
    |> json.to_string_tree

  wisp.response(201)
  |> wisp.json_body(response)
}

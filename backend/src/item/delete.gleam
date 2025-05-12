import gleam/bool
import gleam/json
import gleam/option
import models/item
import server_response
import sqlight
import utils

pub fn delete(id: Int, conn: sqlight.Connection) {
  use item <-
    sqlight.query(
      "DELETE FROM Item WHERE id = ? RETURNING *;",
      conn,
      [sqlight.int(id)],
      item.decode_sqlight(),
    )
    |> utils.sqlight_try_one()
    |> utils.unwrap_error()

  use <- bool.lazy_guard(option.is_none(item), fn() {
    server_response.error("Item now found")
  })

  server_response.success_200("Item successfuly deleted", json.null())
}

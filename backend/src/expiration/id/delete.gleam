import gleam/bool
import gleam/dynamic/decode
import gleam/json
import gleam/option
import server_response
import sqlight
import utils

pub fn delete(id: Int, conn: sqlight.Connection) {
  use item <-
    sqlight.query(
      "DELETE FROM Expiration WHERE id = ? RETURNING id",
      conn,
      [sqlight.int(id)],
      decode.at([0], decode.optional(decode.int)),
    )
    |> utils.sqlight_try_one()
    |> utils.unwrap_error()

  use <- bool.lazy_guard(option.is_none(item), fn() {
    server_response.error("Item now found")
  })

  server_response.success_200("Item successfuly deleted", json.null())
}

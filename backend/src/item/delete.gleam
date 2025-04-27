import gleam/bool
import gleam/dynamic/decode
import gleam/json
import server_response
import sqlight
import utils

pub fn delete(id: Int, conn: sqlight.Connection) {
  use how_many_deleted <-
    sqlight.query(
      "DELETE FROM Item WHERE id = ? RETURNING count(*);",
      conn,
      [sqlight.int(id)],
      decode.int,
    )
    |> utils.sqlight_expect_one

  use <- bool.lazy_guard(how_many_deleted == 0, fn() {
    server_response.error("Item now found")
  })

  server_response.success_200("Item successfuly deleted", json.null())
}

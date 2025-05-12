import gleam/bool
import gleam/dynamic/decode
import gleam/json
import server_response
import sqlight
import utils

pub fn delete(barcode: String, conn: sqlight.Connection) {
  use how_many_deleted <-
    sqlight.query(
      "DELETE FROM Product WHERE barcode = ? RETURNING count(*);",
      conn,
      [sqlight.text(barcode)],
      decode.int,
    )
    |> utils.sqlight_extract_one()
    |> utils.unwrap_error()

  use <- bool.lazy_guard(how_many_deleted == 0, fn() {
    server_response.error("Product now found")
  })

  server_response.success_200("Product successfuly deleted", json.null())
}

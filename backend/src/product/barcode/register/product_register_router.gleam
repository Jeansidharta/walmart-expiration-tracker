import gleam/dynamic/decode
import gleam/http
import gleam/int
import gleam/json
import gleam/result
import server_response
import sqlight
import utils
import wisp

fn delete(conn: sqlight.Connection, barcode: String, register_number: Int) {
  use _ <-
    sqlight.query(
      "
DELETE FROM PermanentProductLocation
WHERE product_barcode = ? AND register = ?
RETURNING register_offset
",
      conn,
      [sqlight.text(barcode), sqlight.int(register_number)],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> result.map_error(fn(_) {
      server_response.error(
        "Could not find product "
        <> barcode
        <> " at register "
        <> int.to_string(register_number),
      )
    })
    |> utils.unwrap_error()

  server_response.success_200("Success!", json.null())
}

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  barcode: String,
) -> wisp.Response {
  case path_segments, req.method {
    [register_number], http.Delete -> {
      use register_number <-
        int.parse(register_number)
        |> result.map_error(fn(_) {
          server_response.error("Invalid register number " <> register_number)
        })
        |> utils.unwrap_error()
      delete(conn, barcode, register_number)
    }
    _, _ -> wisp.not_found()
  }
}

import gleam/dynamic/decode
import gleam/http
import gleam/json
import gleam/result
import server_response
import sqlight
import utils
import wisp

fn post(conn: sqlight.Connection, barcode: String, location: String) {
  use last_update <-
    sqlight.query(
      "INSERT INTO LocationProduct (product_barcode, location) VALUES (?, ?) RETURNING last_update;",
      conn,
      [sqlight.text(barcode), sqlight.text(location)],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> result.map_error(fn(_) {
      server_response.error("Failed to create LocationProduct")
    })
    |> utils.unwrap_error()
  server_response.success_200("Success", json.int(last_update))
}

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  barcode: String,
) -> wisp.Response {
  case path_segments, req.method {
    [location], http.Post -> post(conn, barcode, location)
    _, _ -> wisp.not_found()
  }
}

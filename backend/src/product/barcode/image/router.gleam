import gleam/bit_array
import gleam/bytes_tree
import gleam/dynamic/decode
import gleam/http
import gleam/option
import gleam/result
import gleam/string
import server_response
import sqlight
import utils
import wisp

pub fn get(conn: sqlight.Connection, barcode: String) -> wisp.Response {
  use maybe_image <-
    sqlight.query(
      "SELECT product.image FROM Product WHERE product.barcode = ?;",
      conn,
      [sqlight.text(barcode)],
      decode.at([0], decode.string),
    )
    |> utils.sqlight_try_one()
    |> utils.unwrap_error()

  use image <-
    option.to_result(maybe_image, Nil)
    |> result.map_error(fn(_) {
      server_response.internal_error("Failed to find product")
    })
    |> utils.unwrap_error()

  // Remove the starting "data:image/jpeg;base64," from the image string
  let image = string.crop(from: image, before: "/9j/")

  use image <-
    bit_array.base64_decode(image)
    |> result.map_error(fn(_) {
      server_response.internal_error(
        "Failed to decode image from base64 to bit_array",
      )
    })
    |> utils.unwrap_error()

  wisp.response(200)
  |> wisp.set_header("Content-Type", "image/jpg")
  |> wisp.set_body(
    image
    |> bytes_tree.from_bit_array
    |> wisp.Bytes,
  )
}

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  barcode: String,
) -> wisp.Response {
  case path_segments, req.method {
    [], http.Get -> get(conn, barcode)
    _, _ -> wisp.not_found()
  }
}

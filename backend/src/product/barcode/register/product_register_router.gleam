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

fn get(conn: sqlight.Connection, barcode: String) {
  use rows <-
    sqlight.query(
      "
SELECT product_barcode, register_offset, register
FROM PermanentProductLocation
WHERE product_barcode = ?
ORDER BY register ASC;
",
      conn,
      [sqlight.text(barcode)],
      {
        use product_barcode <- decode.field(0, decode.string)
        use register_offset <- decode.field(1, decode.int)
        use register <- decode.field(2, decode.int)
        decode.success(#(product_barcode, register_offset, register))
      },
    )
    |> result.map_error(fn(_) {
      server_response.error("Could not find product location " <> barcode)
    })
    |> utils.unwrap_error()

  server_response.success_200(
    "Success!",
    json.array(rows, fn(row) {
      let #(product_barcode, register_offset, register) = row
      json.object([
        #("product_barcode", json.string(product_barcode)),
        #("register_offset", json.int(register_offset)),
        #("register", json.int(register)),
      ])
    }),
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

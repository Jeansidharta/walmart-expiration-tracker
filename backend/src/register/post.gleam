import gleam/dynamic/decode
import gleam/json
import gleam/result
import server_response
import sqlight
import utils
import wisp

pub fn post(req: wisp.Request, conn: sqlight.Connection) {
  use body <- wisp.require_json(req)
  use #(product_barcode, register_offset, register) <-
    body
    |> decode.run({
      use product_barcode <- decode.field("product_barcode", decode.string)
      use register_offset <- decode.field("register_offset", decode.int)
      use register <- decode.field("register", decode.int)
      decode.success(#(product_barcode, register_offset, register))
    })
    |> result.map_error(utils.decode_err_server_response)
    |> utils.unwrap_error()

  use _ <-
    sqlight.query(
      "
INSERT INTO PermanentProductLocation
  (product_barcode register register_offset)
VALUES (?, ?, ?)
RETURNING register
",
      conn,
      [
        sqlight.text(product_barcode),
        sqlight.int(register),
        sqlight.int(register_offset),
      ],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> result.map_error(fn(_) {
      server_response.error(
        "Could not create PermanentProductLocation. Does one already exists for this register?",
      )
    })
    |> utils.unwrap_error()

  server_response.success_200("Success!", json.null())
}

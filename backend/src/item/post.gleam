import gleam/dynamic/decode
import models/item
import server_response
import sqlight
import utils
import wisp

pub fn post(req: wisp.Request, conn: sqlight.Connection) -> wisp.Response {
  use body <- wisp.require_json(req)

  use body <-
    body
    |> decode.run(item.decoder_no_id())
    |> utils.if_err(utils.decode_err_server_response)

  use item <-
    sqlight.query(
      "INSERT INTO item (product_barcode, location, expires_at, count) VALUES (?, ?, ?, ?) RETURNING "
        <> item.full_columns(),
      conn,
      [
        sqlight.text(body.product_barcode),
        sqlight.text(body.location),
        sqlight.int(body.expires_at),
        sqlight.int(body.count),
      ],
      item.decode_sqlight(),
    )
    |> utils.sqlight_expect_one

  let response = item |> item.json
  server_response.success_200("Successfuly created item", response)
}

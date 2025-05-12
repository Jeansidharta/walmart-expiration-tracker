import gleam/dynamic/decode
import gleam/result
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
    |> result.map_error(utils.decode_err_server_response)
    |> utils.unwrap_error()

  utils.with_transaction(conn, fn() {
    use _ <- result.then(
      sqlight.query(
        "INSERT INTO LocationProduct (location, product_barcode) VALUES (?, ?) RETURNING last_update",
        conn,
        [sqlight.text(body.location), sqlight.text(body.product_barcode)],
        decode.int,
      )
      |> utils.sqlight_try_one(),
    )

    use item <- result.then(
      sqlight.query("INSERT INTO item
	  (product_barcode, location, expires_at)
	  VALUES (?, ?, ?, ?) RETURNING " <> item.full_columns(), conn, [
        sqlight.text(body.product_barcode),
        sqlight.text(body.location),
        sqlight.int(body.expires_at),
      ], item.decode_sqlight())
      |> utils.sqlight_extract_one(),
    )

    let response = item |> item.json

    Ok(server_response.success_200("Successfuly created item", response))
  })
}

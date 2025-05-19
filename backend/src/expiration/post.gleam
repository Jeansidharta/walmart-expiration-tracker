import gleam/dynamic/decode
import gleam/result
import models/expiration
import server_response
import sqlight
import utils
import wisp

pub fn post(req: wisp.Request, conn: sqlight.Connection) -> wisp.Response {
  use body <- wisp.require_json(req)

  use #(location, product_barcode, expires_at) <-
    body
    |> decode.run({
      use location <- decode.field("location", decode.string)
      use product_barcode <- decode.field("product_barcode", decode.string)
      use expires_at <- decode.field("expires_at", decode.int)
      decode.success(#(location, product_barcode, expires_at))
    })
    |> result.map_error(utils.decode_err_server_response)
    |> utils.unwrap_error()

  utils.with_transaction(conn, fn() {
    use product_location_id <- result.try(
      sqlight.query(
        "SELECT id FROM ProductLocation WHERE product_barcode = ? AND location = ?",
        conn,
        [sqlight.text(product_barcode), sqlight.text(location)],
        decode.at([0], decode.int),
      )
      |> utils.sqlight_try_one(),
    )
    use product_location_id <- result.then(
      sqlight.query(
        "
INSERT OR REPLACE INTO ProductLocation (id, location, product_barcode, last_update)
VALUES (?, ?, ?, (unixepoch() * 1000))
RETURNING id",
        conn,
        [
          sqlight.nullable(sqlight.int, product_location_id),
          sqlight.text(location),
          sqlight.text(product_barcode),
        ],
        decode.at([0], decode.int),
      )
      |> utils.sqlight_extract_one(),
    )

    use expiration <- result.then(
      sqlight.query(
        "INSERT INTO Expiration (product_location_id, expires_at) VALUES (?, ?) RETURNING "
          <> expiration.full_columns(),
        conn,
        [sqlight.int(product_location_id), sqlight.int(expires_at)],
        expiration.decode_sqlight(),
      )
      |> utils.sqlight_extract_one(),
    )

    let response = expiration |> expiration.json

    Ok(server_response.success_200("Successfuly created item", response))
  })
}

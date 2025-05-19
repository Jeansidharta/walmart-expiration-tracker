import gleam/dynamic/decode
import gleam/json
import gleam/result
import server_response
import sqlight
import utils
import wisp

pub fn post(
  req: wisp.Request,
  conn: sqlight.Connection,
  barcode: String,
  location: String,
) {
  use body <- wisp.require_json(req)

  use body <-
    body
    |> decode.run({ decode.at(["last_update"], decode.optional(decode.int)) })
    |> result.map_error(utils.decode_err_server_response)
    |> utils.unwrap_error()

  use last_update <-
    sqlight.query(
      "
WITH Old AS (
    SELECT id FROM ProductLocation
    WHERE product_barcode = ?1 AND location = ?2
)
INSERT OR REPLACE INTO ProductLocation(id, product_barcode, location, last_update)
VALUES (
	(SELECT id FROM Old),
	?1,
	?2,
	?3
)
RETURNING id",
      conn,
      [
        sqlight.text(barcode),
        sqlight.text(location),
        sqlight.nullable(sqlight.int, body),
      ],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> result.map_error(fn(_) {
      server_response.error("Failed to create ProductLocation")
    })
    |> utils.unwrap_error()

  server_response.success_200("Success", json.int(last_update))
}

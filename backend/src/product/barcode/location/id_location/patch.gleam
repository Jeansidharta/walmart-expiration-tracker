import gleam/dynamic/decode
import gleam/json
import gleam/result
import server_response
import sqlight
import utils

pub fn patch(conn: sqlight.Connection, barcode: String, location: String) {
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
	(unixepoch() * 1000)
)
RETURNING id",
      conn,
      [sqlight.text(barcode), sqlight.text(location)],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> result.map_error(fn(_) {
      server_response.error("Failed to create ProductLocation")
    })
    |> utils.unwrap_error()

  server_response.success_200("Success", json.int(last_update))
}

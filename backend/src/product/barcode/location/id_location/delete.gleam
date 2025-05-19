import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/json
import gleam/list
import server_response
import sqlight
import utils

pub fn delete(conn: sqlight.Connection, barcode: String, location: String) {
  use product_locations <-
    sqlight.query(
      "
SELECT Expiration.id FROM Expiration
JOIN ProductLocation ON ProductLocation.id = Expiration.product_location_id
WHERE product_barcode = ? AND location = ?",
      conn,
      [sqlight.text(barcode), sqlight.text(location)],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_many()

  use <- bool.lazy_guard(when: product_locations != [], return: fn() {
    server_response.error(
      "Cannot remove product from location. You must first remove all expirations from this location. There are a total of "
      <> list.length(product_locations) |> int.to_string()
      <> " expirations",
    )
  })

  use _ <-
    sqlight.query(
      "DELETE FROM ProductLocation WHERE product_barcode = ? AND location = ? RETURNING id",
      conn,
      [sqlight.text(barcode), sqlight.text(location)],
      decode.at([0], decode.int),
    )
    |> utils.sqlight_extract_one()
    |> utils.unwrap_error()

  server_response.success_200(
    "Successfuly removed the product from this location",
    json.null(),
  )
}

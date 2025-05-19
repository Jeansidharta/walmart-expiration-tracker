import gleam/dynamic/decode
import gleam/json
import server_response
import sqlight
import utils

pub fn get(conn: sqlight.Connection, barcode: String) {
  use locations <-
    sqlight.query(
      "
SELECT location, last_update FROM ProductLocation
WHERE product_barcode = ?",
      conn,
      [sqlight.text(barcode)],
      {
        use location <- decode.field(0, decode.string)
        use last_update <- decode.field(1, decode.optional(decode.int))
        decode.success(#(location, last_update))
      },
    )
    |> utils.sqlight_many()

  server_response.success_200(
    "Success",
    json.array(locations, fn(location_item) {
      let #(location, last_update) = location_item
      json.object([
        #("location", json.string(location)),
        #("last_update", json.nullable(last_update, json.int)),
      ])
    }),
  )
}

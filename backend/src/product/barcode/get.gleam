import gleam/dynamic/decode
import gleam/json
import gleam/option
import models/expiration
import models/product
import server_response
import sqlight
import utils
import wisp

pub fn get(barcode: String, conn: sqlight.Connection) -> wisp.Response {
  use product <-
    sqlight.query(
      "SELECT "
        <> product.full_columns()
        <> " FROM Product "
        <> "WHERE product.barcode = ?;",
      conn,
      [sqlight.text(barcode)],
      product.decode_sqlight(),
    )
    |> utils.sqlight_try_one()
    |> utils.unwrap_error()

  option.map(product, fn(product) {
    use expirations <-
      sqlight.query(
        "SELECT "
          <> expiration.full_columns()
          <> ", ProductLocation.location"
          <> " FROM Product"
          <> " JOIN ProductLocation ON product.barcode = ProductLocation.product_barcode"
          <> " JOIN Expiration ON ProductLocation.id = Expiration.product_location_id"
          <> " WHERE product.barcode = ?"
          <> " ORDER BY expires_at ASC;",
        conn,
        [sqlight.text(barcode)],
        {
          use id <- decode.field(0, decode.int)
          use creation_date <- decode.field(1, decode.int)
          use product_location_id <- decode.field(2, decode.int)
          use expires_at <- decode.field(3, decode.int)
          use location <- decode.field(4, decode.string)
          decode.success(#(
            expiration.Expiration(
              id:,
              product_location_id:,
              creation_date:,
              expires_at:,
            ),
            location,
          ))
        },
      )
      |> utils.sqlight_many

    server_response.success_200(
      "Success",
      json.object([
        #(
          "expirations",
          json.array(expirations, fn(expiration_tuple) {
            let #(expiration, location) = expiration_tuple
            json.object([
              #("id", json.int(expiration.id)),
              #("creation_date", json.int(expiration.creation_date)),
              #("product_location_id", json.int(expiration.product_location_id)),
              #("expires_at", json.int(expiration.expires_at)),
              #("location", json.string(location)),
            ])
          }),
        ),
        #("product", product.json(product)),
      ]),
    )
  })
  |> option.lazy_unwrap(fn() { server_response.error("Product Not Found") })
}

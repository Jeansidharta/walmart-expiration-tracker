import gleam/json
import gleam/option
import models/item
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
    use items <-
      sqlight.query(
        "SELECT "
          <> item.full_columns()
          <> " FROM Product "
          <> " JOIN Item ON product.barcode = item.product_barcode"
          <> " WHERE product.barcode = ?"
          <> " ORDER BY expires_at ASC;",
        conn,
        [sqlight.text(barcode)],
        item.decode_sqlight(),
      )
      |> utils.sqlight_many
    server_response.success_200(
      "Success",
      json.object([
        #("items", json.array(items, item.json)),
        #("product", product.json(product)),
      ]),
    )
  })
  |> option.lazy_unwrap(fn() { server_response.error("Product Not Found") })
}

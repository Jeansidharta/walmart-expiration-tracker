import gleam/dynamic/decode
import gleam/json
import models/product
import sqlight
import utils
import wisp

pub fn post(req: wisp.Request, conn: sqlight.Connection) -> wisp.Response {
  use body <- wisp.require_json(req)

  use body <-
    body
    |> decode.run(product.decoder_no_create_date())
    |> utils.if_err(utils.decode_err_server_response)

  use product <-
    sqlight.query(
      "INSERT INTO Product (barcode, image, name) VALUES (?, ?, ?) RETURNING "
        <> product.full_columns(),
      conn,
      [
        sqlight.text(body.barcode),
        sqlight.text(body.image),
        sqlight.nullable(sqlight.text, body.name),
      ],
      product.decode_sqlight(),
    )
    |> utils.sqlight_expect_one

  let response =
    product
    |> product.json
    |> json.to_string_tree

  wisp.response(200)
  |> wisp.json_body(response)
}

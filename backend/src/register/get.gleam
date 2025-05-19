import gleam/dict
import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import server_response
import sqlight
import utils

pub fn get(
  conn: sqlight.Connection,
  query: dict.Dict(String, String),
  register_number: Int,
) {
  use page, page_size <- utils.query_params_extract_pagination(query)
  let query =
    "
SELECT
    ProductLocation.product_barcode,
    ProductLocation.location,
    Product.name,
    ProductLocation.last_update
FROM ProductLocation
JOIN Product ON Product.barcode = ProductLocation.product_barcode
JOIN Location ON Location.location = ProductLocation.location
WHERE Location.register = ?
ORDER BY last_update ASC;"

  use result <-
    sqlight.query(
      query,
      conn,
      with: [sqlight.int(register_number)],
      expecting: {
        use barcode <- decode.field(0, decode.string)
        use location <- decode.field(1, decode.string)
        use name <- decode.field(2, decode.string)
        use last_update <- decode.field(3, decode.optional(decode.int))
        decode.success(#(barcode, location, name, last_update))
      },
    )
    |> utils.sqlight_many()

  let paginated_results =
    result
    |> list.drop(page * option.unwrap(page_size, 0))
    |> list.take(option.unwrap(page_size, list.length(result)))

  server_response.success_200(
    "Success",
    json.object([
      #("total_items", json.int(list.length(result))),
      #(
        "products",
        json.array(paginated_results, fn(arg) {
          let #(barcode, location, name, last_update) = arg
          json.object([
            #("barcode", json.string(barcode)),
            #("location", json.string(location)),
            #("name", json.string(name)),
            #("last_update", json.nullable(last_update, json.int)),
          ])
        }),
      ),
    ]),
  )
}

import gleam/dynamic/decode
import gleam/http
import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import server_response
import sqlight
import utils
import wisp

fn get(conn: sqlight.Connection, register_number: Int) {
  let query =
    "
SELECT
	product.barcode,
	PermanentProductLocation.register_offset,
	product.name,
	LocationProduct.last_update
FROM PermanentProductLocation
LEFT JOIN Product ON PermanentProductLocation.product_barcode = product.barcode
LEFT JOIN (
    SELECT last_update, product_barcode
    FROM LocationProduct
    JOIN Location ON LocationProduct.location = Location.location
    WHERE register = ?1
) as LocationProduct ON LocationProduct.product_barcode = product.barcode
WHERE PermanentProductLocation.register = ?1
AND PermanentProductLocation.register_offset IN (
    SELECT register_offset FROM Location WHERE Location.register = ?1
)
ORDER BY LocationProduct.last_update ASC;
"

  use result <-
    sqlight.query(
      query,
      conn,
      with: [sqlight.int(register_number)],
      expecting: {
        use barcode <- decode.field(0, decode.string)
        use register_offset <- decode.field(1, decode.int)
        use name <- decode.field(2, decode.string)
        use last_update <- decode.field(3, decode.optional(decode.int))
        decode.success(#(barcode, register_offset, name, last_update))
      },
    )
    |> utils.sqlight_many()

  let checked =
    list.filter_map(result, fn(a) {
      case a {
        #(a, b, c, option.Some(v)) -> Ok(#(a, b, c, v))
        #(_, _, _, option.None) -> Error(Nil)
      }
    })
  let unchecked =
    list.filter_map(result, fn(a) {
      case a {
        #(a, b, c, option.None) -> Ok(#(a, b, c))
        #(_, _, _, option.Some(_)) -> Error(Nil)
      }
    })

  server_response.success_200(
    "Success",
    json.object([
      #(
        "checked",
        json.array(checked, fn(arg) {
          let #(barcode, register_offset, name, last_update) = arg
          json.object([
            #("barcode", json.string(barcode)),
            #("register_offset", json.int(register_offset)),
            #("name", json.string(name)),
            #("last_update", json.int(last_update)),
          ])
        }),
      ),
      #(
        "unchecked",
        json.array(unchecked, fn(arg) {
          let #(barcode, register_offset, name) = arg
          json.object([
            #("barcode", json.string(barcode)),
            #("register_offset", json.int(register_offset)),
            #("name", json.string(name)),
          ])
        }),
      ),
    ]),
  )
}

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
) -> wisp.Response {
  case path_segments, req.method {
    [register_number], http.Get -> {
      use register_number <-
        int.parse(register_number)
        |> result.map_error(fn(_) {
          server_response.error("Invalid register number " <> register_number)
        })
        |> utils.unwrap_error()

      get(conn, register_number)
    }
    _, _ -> wisp.not_found()
  }
}

import gleam/erlang
import gleam/erlang/process
import item/item
import migrant
import mist
import product/product
import server_response
import sqlight
import wisp
import wisp/wisp_mist

pub type Item {
  Item(
    id: Int,
    creation_date: Int,
    location: String,
    expires_at: Int,
    count: Int,
  )
}

pub fn middleware(
  request: wisp.Request,
  handle_request: fn(wisp.Request) -> wisp.Response,
) {
  let req = wisp.method_override(request)
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)
  handle_request(req)
}

pub fn request_handler(
  req: wisp.Request,
  conn: sqlight.Connection,
) -> wisp.Response {
  use req <- middleware(req)
  case wisp.path_segments(req) {
    ["product", ..path] -> product.router(req, conn, path)
    ["item", ..path] -> item.router(req, conn, path)
    _ -> server_response.error_with_code("Invalid API Rest Path", 404)
  }
}

pub fn main() {
  use conn <- sqlight.with_connection("file:db.sqlite3")
  let assert Ok(priv) = erlang.priv_directory("backend_gleam")
  let assert Ok(_) = migrant.migrate(conn, priv <> "/migrations")

  wisp.configure_logger()

  let port = 8080

  let assert Ok(_) =
    wisp_mist.handler(request_handler(_, conn), "UNUSED_FOR_NOW")
    |> mist.new
    |> mist.bind("0.0.0.0")
    |> mist.port(port)
    |> mist.start_http

  process.sleep_forever()
}

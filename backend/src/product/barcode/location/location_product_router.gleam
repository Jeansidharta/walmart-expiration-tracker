import gleam/http
import product/barcode/location/get.{get}
import product/barcode/location/id_location/router.{router as location_router}
import sqlight
import wisp

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  barcode: String,
) -> wisp.Response {
  case path_segments, req.method {
    [], http.Get -> get(conn, barcode)
    [location, ..rest], _ -> location_router(req, conn, rest, barcode, location)
    _, _ -> wisp.not_found()
  }
}

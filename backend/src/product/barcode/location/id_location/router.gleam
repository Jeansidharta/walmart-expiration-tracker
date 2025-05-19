import gleam/http
import product/barcode/location/id_location/delete.{delete}
import product/barcode/location/id_location/patch.{patch}
import product/barcode/location/id_location/post.{post}
import sqlight
import wisp

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  barcode: String,
  location: String,
) -> wisp.Response {
  case path_segments, req.method {
    [], http.Post -> post(req, conn, barcode, location)
    [], http.Patch -> patch(conn, barcode, location)
    [], http.Delete -> delete(conn, barcode, location)
    _, _ -> wisp.not_found()
  }
}

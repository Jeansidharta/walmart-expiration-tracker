import expiration/id/delete.{delete}
import expiration/id/get.{get}
import gleam/http
import sqlight
import wisp

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  id: Int,
) -> wisp.Response {
  case path_segments, req.method {
    [], http.Get -> get(id, conn)
    [], http.Delete -> delete(id, conn)
    _, _ -> wisp.not_found()
  }
}

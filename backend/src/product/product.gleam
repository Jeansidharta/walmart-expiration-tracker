import gleam/dict
import gleam/http
import product/delete.{delete}
import product/get.{get}
import product/list.{list}
import product/post.{post}
import sqlight
import wisp

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
) -> wisp.Response {
  let queries = wisp.get_query(req) |> dict.from_list()
  case path_segments, req.method {
    [], http.Get -> list(conn, queries)
    [], http.Post -> post(req, conn)
    [barcode], method -> {
      case method {
        http.Get -> get(barcode, conn)
        http.Delete -> delete(barcode, conn)
        _ -> wisp.not_found()
      }
    }
    _, _ -> wisp.not_found()
  }
}

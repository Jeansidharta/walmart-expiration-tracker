import gleam/dict
import gleam/http
import gleam/int
import gleam/result
import item/delete.{delete}
import item/get.{get}
import item/list.{list}
import item/post.{post}
import server_response
import sqlight
import utils
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
    [id], method -> {
      use id <-
        int.parse(id)
        |> result.map_error(fn(_) {
          server_response.error("Invalid id: " <> id)
        })
        |> utils.unwrap_error()
      case method {
        http.Get -> get(id, conn)
        http.Delete -> delete(id, conn)
        _ -> wisp.not_found()
      }
    }
    _, _ -> wisp.not_found()
  }
}

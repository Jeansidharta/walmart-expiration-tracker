import expiration/id/expiration_id_router.{router as expiration_id_router}
import expiration/list.{list}
import expiration/post.{post}
import gleam/dict
import gleam/http
import gleam/int
import gleam/result
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
    [id, ..rest], _ -> {
      use id <-
        int.parse(id)
        |> result.map_error(fn(_) {
          server_response.error("Invalid id: " <> id)
        })
        |> utils.unwrap_error()
      expiration_id_router(req, conn, rest, id)
    }
    _, _ -> wisp.not_found()
  }
}

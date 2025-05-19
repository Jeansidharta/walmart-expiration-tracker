import gleam/dict
import gleam/http
import gleam/int
import gleam/result
import register/get.{get}
import register/post.{post}
import server_response
import sqlight
import utils
import wisp

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
) -> wisp.Response {
  let query = wisp.get_query(req) |> dict.from_list()
  case path_segments, req.method {
    [], http.Post -> post(req, conn)
    [register_number], http.Get -> {
      use register_number <-
        int.parse(register_number)
        |> result.map_error(fn(_) {
          server_response.error("Invalid register number " <> register_number)
        })
        |> utils.unwrap_error()

      get(conn, query, register_number)
    }
    _, _ -> wisp.not_found()
  }
}

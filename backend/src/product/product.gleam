import gleam/dict
import gleam/http
import product/barcode/router.{router as barcode_router}
import product/get.{get}
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
    [], http.Get -> get(conn, queries)
    [], http.Post -> post(req, conn)
    [barcode, ..rest], _ -> barcode_router(req, conn, rest, barcode)
    _, _ -> wisp.not_found()
  }
}

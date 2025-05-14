import gleam/http
import product/barcode/delete.{delete}
import product/barcode/get.{get}
import product/barcode/image/router.{router as image_router}
import product/barcode/location/location_product_router.{
  router as location_product_router,
}
import product/barcode/register/product_register_router.{
  router as product_register_router,
}
import sqlight
import wisp

pub fn router(
  req: wisp.Request,
  conn: sqlight.Connection,
  path_segments: List(String),
  barcode: String,
) -> wisp.Response {
  case path_segments, req.method {
    ["image", ..rest], _ -> image_router(req, conn, rest, barcode)
    ["location", ..rest], _ -> location_product_router(req, conn, rest, barcode)
    ["register", ..rest], _ -> product_register_router(req, conn, rest, barcode)
    [], http.Get -> get(barcode, conn)
    [], http.Delete -> delete(barcode, conn)
    _, _ -> wisp.not_found()
  }
}

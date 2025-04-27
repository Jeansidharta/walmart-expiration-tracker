import gleam/dynamic/decode
import gleam/json
import gleam/string

pub type Item {
  Item(
    id: Int,
    creation_date: Int,
    product_barcode: String,
    location: String,
    expires_at: Int,
    count: Int,
  )
}

pub const columns = [
  "item.id", "item.creation_date", "item.product_barcode", "item.location",
  "item.expires_at", "item.count",
]

pub fn full_columns() {
  string.join(columns, ",")
}

pub fn decoder() -> decode.Decoder(Item) {
  use id <- decode.field("id", decode.int)
  use creation_date <- decode.field("creation_date", decode.int)
  use product_barcode <- decode.field("product_barcode", decode.string)
  use location <- decode.field("location", decode.string)
  use expires_at <- decode.field("expires_at", decode.int)
  use count <- decode.field("count", decode.int)
  decode.success(Item(
    id:,
    creation_date:,
    product_barcode:,
    location:,
    expires_at:,
    count:,
  ))
}

pub fn decode_sqlight_from(base: Int) {
  use id <- decode.field(base + 0, decode.int)
  use creation_date <- decode.field(base + 1, decode.int)
  use product_barcode <- decode.field(base + 2, decode.string)
  use location <- decode.field(base + 3, decode.string)
  use expires_at <- decode.field(base + 4, decode.int)
  use count <- decode.field(base + 5, decode.int)
  decode.success(Item(
    id:,
    creation_date:,
    product_barcode:,
    location:,
    expires_at:,
    count:,
  ))
}

pub fn decode_sqlight() {
  decode_sqlight_from(0)
}

pub fn json(product: Item) -> json.Json {
  json.object([
    #("id", json.int(product.id)),
    #("creation_date", json.int(product.creation_date)),
    #("product_barcode", json.string(product.product_barcode)),
    #("location", json.string(product.location)),
    #("expires_at", json.int(product.expires_at)),
    #("count", json.int(product.count)),
  ])
}

pub type ItemNoId {
  ItemNoId(
    product_barcode: String,
    location: String,
    expires_at: Int,
    count: Int,
  )
}

pub fn decoder_no_id() -> decode.Decoder(ItemNoId) {
  use product_barcode <- decode.field("product_barcode", decode.string)
  use location <- decode.field("location", decode.string)
  use expires_at <- decode.field("expires_at", decode.int)
  use count <- decode.field("count", decode.int)
  decode.success(ItemNoId(product_barcode:, location:, expires_at:, count:))
}

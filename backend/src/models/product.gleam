import gleam/dynamic/decode
import gleam/json
import gleam/option
import gleam/string

pub type Product {
  Product(
    barcode: String,
    creation_date: Int,
    name: option.Option(String),
    image: String,
  )
}

pub const columns = [
  "product.barcode", "product.creation_date", "product.name", "product.image",
]

pub fn full_columns() {
  string.join(columns, ",")
}

pub fn decoder() -> decode.Decoder(Product) {
  use barcode <- decode.field("barcode", decode.string)
  use creation_date <- decode.field("creation_date", decode.int)
  use name <- decode.field("name", decode.optional(decode.string))
  use image <- decode.field("image", decode.string)
  decode.success(Product(barcode:, creation_date:, name:, image:))
}

pub fn decode_sqlight_from(base: Int) {
  use barcode <- decode.field(base + 0, decode.string)
  use creation_date <- decode.field(base + 1, decode.int)
  use name <- decode.field(base + 2, decode.optional(decode.string))
  use image <- decode.field(base + 3, decode.string)
  decode.success(Product(barcode:, creation_date:, name:, image:))
}

pub fn decode_sqlight() {
  decode_sqlight_from(0)
}

pub fn json(product: Product) -> json.Json {
  json.object([
    #("barcode", json.string(product.barcode)),
    #("creation_date", json.int(product.creation_date)),
    #("name", json.nullable(product.name, json.string)),
    #("image", json.string(product.image)),
  ])
}

pub type ProductNoId {
  ProductNoId(barcode: String, image: String, name: option.Option(String))
}

pub fn decoder_no_create_date() -> decode.Decoder(ProductNoId) {
  use barcode <- decode.field("barcode", decode.string)
  use image <- decode.field("image", decode.string)
  use name <- decode.field("name", decode.optional(decode.string))
  decode.success(ProductNoId(barcode:, image:, name:))
}

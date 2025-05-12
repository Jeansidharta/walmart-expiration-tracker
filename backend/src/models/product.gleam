import gleam/dynamic/decode
import gleam/json
import gleam/option
import gleam/string

pub type Product {
  Product(barcode: String, creation_date: Int, name: option.Option(String))
}

pub type ProductWithImage {
  ProductWithImage(
    barcode: String,
    creation_date: Int,
    name: option.Option(String),
    image: String,
  )
}

pub type ProductNoIdWithImage {
  ProductNoIdWithImage(
    barcode: String,
    image: String,
    name: option.Option(String),
  )
}

pub const columns = ["product.barcode", "product.creation_date", "product.name"]

pub fn full_columns() {
  string.join(columns, ",")
}

pub fn decoder() -> decode.Decoder(ProductWithImage) {
  use barcode <- decode.field("barcode", decode.string)
  use creation_date <- decode.field("creation_date", decode.int)
  use name <- decode.field("name", decode.optional(decode.string))
  use image <- decode.field("image", decode.string)
  decode.success(ProductWithImage(barcode:, creation_date:, name:, image:))
}

pub fn decode_sqlight_from(base: Int) {
  use barcode <- decode.field(base + 0, decode.string)
  use creation_date <- decode.field(base + 1, decode.int)
  use name <- decode.field(base + 2, decode.optional(decode.string))
  decode.success(Product(barcode:, creation_date:, name:))
}

pub fn decode_sqlight() {
  decode_sqlight_from(0)
}

pub fn json(product: Product) -> json.Json {
  json.object([
    #("barcode", json.string(product.barcode)),
    #("creation_date", json.int(product.creation_date)),
    #("name", json.nullable(product.name, json.string)),
  ])
}

pub fn decoder_no_create_date() -> decode.Decoder(ProductNoIdWithImage) {
  use barcode <- decode.field("barcode", decode.string)
  use image <- decode.field("image", decode.string)
  use name <- decode.field("name", decode.optional(decode.string))
  decode.success(ProductNoIdWithImage(barcode:, image:, name:))
}

import gleam/dynamic/decode
import gleam/json
import gleam/string

pub type Expiration {
  Expiration(
    id: Int,
    creation_date: Int,
    product_location_id: Int,
    expires_at: Int,
  )
}

pub const columns = [
  "expiration.id", "expiration.creation_date", "expiration.product_location_id",
  "expiration.expires_at",
]

pub fn full_columns() {
  string.join(columns, ",")
}

pub fn decoder() -> decode.Decoder(Expiration) {
  use id <- decode.field("id", decode.int)
  use creation_date <- decode.field("creation_date", decode.int)
  use product_location_id <- decode.field("product_location_id", decode.int)
  use expires_at <- decode.field("expires_at", decode.int)
  decode.success(Expiration(
    id:,
    product_location_id:,
    creation_date:,
    expires_at:,
  ))
}

pub fn decode_sqlight_from(base: Int) {
  use id <- decode.field(base + 0, decode.int)
  use creation_date <- decode.field(base + 1, decode.int)
  use product_location_id <- decode.field(base + 2, decode.int)
  use expires_at <- decode.field(base + 3, decode.int)
  decode.success(Expiration(
    id:,
    product_location_id:,
    creation_date:,
    expires_at:,
  ))
}

pub fn decode_sqlight() {
  decode_sqlight_from(0)
}

pub fn json(expiration: Expiration) -> json.Json {
  json.object([
    #("id", json.int(expiration.id)),
    #("creation_date", json.int(expiration.creation_date)),
    #("product_location_id", json.int(expiration.product_location_id)),
    #("expires_at", json.int(expiration.expires_at)),
  ])
}

pub type ExpirationNoId {
  ExpirationNoId(product_location_id: Int, expires_at: Int)
}

pub fn decoder_no_id() -> decode.Decoder(ExpirationNoId) {
  use product_location_id <- decode.field("product_location_id", decode.int)
  use expires_at <- decode.field("expires_at", decode.int)
  decode.success(ExpirationNoId(product_location_id:, expires_at:))
}

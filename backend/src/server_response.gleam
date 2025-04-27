import gleam/json
import wisp

pub fn success_200(message: String, data: json.Json) -> wisp.Response {
  let body =
    json.object([
      #("success", json.bool(True)),
      #("message", json.string(message)),
      #("data", data),
    ])
    |> json.to_string_tree

  wisp.response(200) |> wisp.json_body(body)
}

pub fn error_with_code(message: String, code: Int) -> wisp.Response {
  let body =
    json.object([
      #("success", json.bool(False)),
      #("message", json.string(message)),
    ])
    |> json.to_string_tree

  wisp.response(code) |> wisp.json_body(body)
}

pub fn error(message: String) -> wisp.Response {
  error_with_code(message, 400)
}

pub fn internal_error() -> wisp.Response {
  let body =
    json.object([
      #("success", json.bool(False)),
      #("message", json.string("Internal Server Error")),
    ])
    |> json.to_string_tree

  wisp.response(500) |> wisp.json_body(body)
}

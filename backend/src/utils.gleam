import gleam/dict
import gleam/dynamic/decode
import gleam/int
import gleam/list
import gleam/option
import gleam/result
import gleam/string
import server_response
import sqlight
import wisp

pub fn decode_error_to_string(err: decode.DecodeError) -> String {
  "While parsing "
  <> string.join(err.path, "/")
  <> ", expected "
  <> err.expected
  <> ", found "
  <> err.found
}

pub fn decode_err_server_response(
  errs: List(decode.DecodeError),
) -> wisp.Response {
  errs
  |> list.map(decode_error_to_string)
  |> string.join("\n")
  |> server_response.error
}

pub fn if_err(result: Result(a, b), if_err: fn(b) -> c) -> fn(fn(a) -> c) -> c {
  fn(f) {
    case result {
      Ok(o) -> f(o)
      Error(e) -> if_err(e)
    }
  }
}

pub fn sqlight_many(val: Result(List(value), sqlight.Error)) {
  val
  |> result.try_recover(fn(err) {
    wisp.log_error(err.message)
    Error(Nil)
  })
  |> if_err(fn(_) { server_response.internal_error() })
}

pub fn sqlight_expect_one(val: Result(List(value), sqlight.Error)) {
  val
  |> result.try_recover(fn(err) {
    wisp.log_error(err.message)
    Error(Nil)
  })
  |> result.then(fn(a) { list.first(a) })
  |> if_err(fn(_) { server_response.internal_error() })
}

pub fn sqlight_extract_one(val: Result(List(value), sqlight.Error)) {
  val
  |> result.try_recover(fn(err) {
    wisp.log_error(err.message)
    Error(Nil)
  })
  |> result.map(fn(a) { list.first(a) |> option.from_result })
  |> if_err(fn(_) { server_response.internal_error() })
}

pub fn extract_param_bool(
  queries: dict.Dict(String, String),
  param_name: String,
  when_error: fn() -> wisp.Response,
  callback: fn(option.Option(Bool)) -> wisp.Response,
) -> wisp.Response {
  case dict.get(queries, param_name) |> result.unwrap("") {
    "true" -> callback(option.Some(True))
    "false" -> callback(option.Some(False))
    "" -> callback(option.None)
    _ -> when_error()
  }
}

pub fn extract_param_int(
  queries: dict.Dict(String, String),
  param_name: String,
  when_error: fn() -> wisp.Response,
  callback: fn(option.Option(Int)) -> wisp.Response,
) -> wisp.Response {
  let parse_result =
    dict.get(queries, param_name)
    |> result.map(fn(size) { int.parse(size) |> result.map(option.Some) })
    |> result.unwrap(Ok(option.None))

  case parse_result {
    Error(_) -> when_error()
    Ok(num) -> callback(num)
  }
}

pub fn query_params_extract_pagination(
  queries: dict.Dict(String, String),
  callback: fn(String) -> wisp.Response,
) -> wisp.Response {
  use page <- extract_param_int(queries, "page", fn() {
    server_response.error("Page query param must be a valid integer")
  })
  let page = option.unwrap(page, 0)

  use page_size <- extract_param_int(queries, "page_size", fn() {
    server_response.error("Page size query param must be a valid integer")
  })

  let sql_query_part = case page_size {
    option.Some(page_size) ->
      " LIMIT " <> int.to_string(page_size) <> " OFFSET " <> int.to_string(page * page_size)
    option.None -> ""
  }

  callback(sql_query_part)
}

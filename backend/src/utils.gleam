import gleam/dynamic/decode
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

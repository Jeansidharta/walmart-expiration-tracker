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

pub fn unwrap_error(result: Result(a, b)) -> fn(fn(a) -> b) -> b {
  fn(otherwise) {
    case result {
      Ok(o) -> otherwise(o)
      Error(e) -> e
    }
  }
}

pub fn sqlight_many(val: Result(List(value), sqlight.Error)) {
  val
  |> result.try_recover(fn(err) {
    wisp.log_error(err.message)
    Error(server_response.internal_error("Failed to extract many"))
  })
  |> unwrap_error()
}

pub fn sqlight_try_one(val: Result(List(value), sqlight.Error)) {
  val
  |> result.try_recover(fn(err) {
    wisp.log_error(err.message)
    Error(server_response.internal_error("Failed to extract one"))
  })
  |> result.map(fn(a) { list.first(a) |> option.from_result })
}

pub fn sqlight_extract_one(val: Result(List(value), sqlight.Error)) {
  sqlight_try_one(val)
  |> result.then(fn(v) {
    option.to_result(v, server_response.internal_error("Failed to extract one"))
  })
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
  callback: fn(Int, option.Option(Int)) -> wisp.Response,
) -> wisp.Response {
  use page <- extract_param_int(queries, "page", fn() {
    server_response.error("Page query param must be a valid integer")
  })
  let page = option.unwrap(page, 0)

  use page_size <- extract_param_int(queries, "page_size", fn() {
    server_response.error("Page size query param must be a valid integer")
  })

  callback(page, page_size)
}

pub fn query_params_sqlite(
  queries: dict.Dict(String, String),
  callback: fn(String) -> wisp.Response,
) -> wisp.Response {
  use page, page_size <- query_params_extract_pagination(queries)

  let sql_query_part = case page_size {
    option.Some(page_size) ->
      " LIMIT "
      <> int.to_string(page_size)
      <> " OFFSET "
      <> int.to_string(page * page_size)
    option.None -> ""
  }

  callback(sql_query_part)
}

pub fn lazy_unwrap_error(res: Result(a, b), callback: fn(a) -> b) -> b {
  case res {
    Error(e) -> e
    Ok(o) -> callback(o)
  }
}

pub fn with_transaction(
  conn: sqlight.Connection,
  callback: fn() -> Result(wisp.Response, wisp.Response),
) -> wisp.Response {
  use _ <- lazy_unwrap_error(
    sqlight.exec("BEGIN TRANSACTION", conn)
    |> result.map_error(fn(_) {
      server_response.internal_error("Failed to begin transaction")
    }),
  )

  case callback() {
    Error(e) -> {
      use _ <- lazy_unwrap_error(
        sqlight.exec("ROLLBACK TRANSACTION", conn)
        |> result.map_error(fn(_) {
          server_response.internal_error("Failed to rollback transaction")
        }),
      )
      e
    }
    Ok(v) -> {
      use _ <- lazy_unwrap_error(
        sqlight.exec("COMMIT TRANSACTION", conn)
        |> result.map_error(fn(_) {
          server_response.internal_error("Failed to commit transaction")
        }),
      )
      v
    }
  }
}

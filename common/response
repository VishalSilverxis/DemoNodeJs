exports.response = function response(
  status = true,
  message = "Success",
  data = {}
) {
  return {
    status: status,
    message: message,
    data: data,
  };
};

exports.payload = (data, keys) => {
  var { keys, ...details } = data;
  return details;
};

exports.pagination = (page, limit, total, data) => {
  return {
    current_page: page,
    total_records: total,
    per_page: limit,
    last_page: Math.ceil(total / limit),
    data: data,
  };
};

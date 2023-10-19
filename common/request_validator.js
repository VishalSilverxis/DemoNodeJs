const { validationResult } = require("express-validator");
//const { BadRequest } = require("../common/status");
const { response } = require("../common/response");

exports.isValidRequest = (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.json(response(false, validationResult(req).array()[0].msg));
    return false;
  }
  return true;
};

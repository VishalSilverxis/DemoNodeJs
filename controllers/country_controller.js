const { response, pagination } = require("../common/response");
const Country = require("../models/country");
const { InternalServerError } = require("../common/status");
const { success, fail } = require("../common/strings");
const { cleanObject } = require("../utils/object_helper");
const { isValidRequest } = require("../common/request_validator");

exports.getCountry = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  
  if (req.body.id) {
    try {
      const responce = await Country.findById(req.body.id);
      return res.json(response(true, success, cleanObject(responce._doc)));
    } catch (error) {
      return res.json(response(false, fail, "invalid id"));
    }
  }
  try {
    
    const responce = await Country.find().sort()
    const newArray = responce.map((ele) => {
      return cleanObject(ele._doc);
    });

    return res.json(
      response(true, success, newArray)
    );
  } catch (e) {
    return res.status(InternalServerError).json(response(false, e.message));
  }
};

exports.addCountry = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  try {
    const data = req.body;
    const newCountry = Country({
      name: data.name.trim().toLowerCase(),
      code: data.code.trim().toUpperCase(),
      mobile_code: data.mobile_code.trim(),
      flag: data.flag,
    });
    const result = await newCountry.save();
    return res.json(response(true, success, cleanObject(result._doc)));
  } catch (e) {
    if (e.name == "MongoServerError") {
      return res.json(response(false, "Country code already exists"));
    }

    return res.status(InternalServerError).json(response(false, e.message));
  }
};

exports.patchCountry = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  try {
    const data = req.body;
    const filter = { _id: data.id };
    delete data.id;
    delete data._id;
    delete data.is_default;
    data.updated_at = Date.now();
    const result = await Country.findOneAndUpdate(filter, data, {
      new: true,
    });
    return res.json(response(true, success, cleanObject(result._doc)));
  } catch (e) {
    return res.status(InternalServerError).json(response(false, e.message));
  }
};

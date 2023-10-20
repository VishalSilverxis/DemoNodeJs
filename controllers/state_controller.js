const { response, pagination } = require("../common/response");
const State = require("../models/state");
const { InternalServerError, InsertSuccess } = require("../common/status");
const { success, fail } = require("../common/strings");
const { cleanObject } = require("../utils/object_helper");
const { isValidRequest } = require("../common/request_validator");

exports.getState = async (req, res) => {
  if (req.body.id) {
    try {
      const responce = await State.findById(req.body.id).populate("country");
      if (responce._doc.country) {
        cleanObject(responce._doc.country._doc);
      }
      cleanObject(responce._doc);

      return res.json(response(true, success, cleanObject(responce._doc)));
    } catch (error) {
      return res.json(response(false, fail, "invalid id"));
    }
  }
  try {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;
    const total = await State.count({});
    const sortdata = req.body.sort || {};
    const filters = {
      name: {
        $regex: (req.body.name || "").trim().toLowerCase(),
        $options: "i",
      },
      deleted_at: null,
    };
    if (req.body.status !== undefined && req.body.status !== "") {
      filters.status = req.body.status;
    }
    if (req.body.country_id) {
      filters.country = req.body.country_id;
    }
    const responce = await State.find(filters)
      .populate("country")
      .sort(sortdata)
      .skip((page - 1) * limit)
      .limit(limit);
    const newArray = responce.map((ele) => {
      if (ele._doc.country) {
        cleanObject(ele._doc.country._doc);
      }
      return cleanObject(ele._doc);
    });

    return res.json(
      response(true, success, pagination(page, limit, total, newArray))
    );
  } catch (e) {
    return res.status(InternalServerError).json(response(false, e.message));
  }
};

exports.addState = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  try {
    const data = req.body;
    const newState = State({
      name: data.name.trim().toLowerCase(),
      country: data.country_id,
      state_code: data.state_code.trim().toUpperCase(),
    });
    const result = await newState.save();
    return res
      .status(InsertSuccess)
      .json(response(true, success, cleanObject(result._doc)));
  } catch (e) {
    if (e.name == "MongoServerError") {
      return res.json(response(false, "State code already exists"));
    }
    return res.status(InternalServerError).json(response(false, e.message));
  }
};

exports.patchState = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  try {
    const data = req.body;
    const filter = { _id: data.id };
    delete data.id;
    delete data._id;
    data.country = data.country_id;
    delete data.country_id;
    data.updated_at = Date.now();
    const result = await State.findOneAndUpdate(filter, data, {
      new: true,
    });
    return res.json(response(true, success, cleanObject(result._doc)));
  } catch (e) {
    return res.status(InternalServerError).json(response(false, e.message));
  }
};

exports.deleteState = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  try {
    const filter = { _id: req.body.id };

    const result = await State.findOneAndUpdate(
      filter,
      { deleted_at: Date.now(), updated_at: Date.now() },
      { new: true }
    );
    return res.json(response(true, success, {}));
  } catch (e) {
    return res.status(InternalServerError).json(response(false, e.message));
  }
};

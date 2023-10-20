
const { isValidRequest } = require("../common/request_validator");
const { response } = require("../common/response");
const { InternalServerError } = require("../common/status");
const { success } = require("../common/strings");
const User = require("../models/user");
const { cleanObject } = require("../utils/object_helper");

exports.getUser = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }

  try {

    // Get request body
    const data = req.body;

    // Check for id exist in request
    // If id exist than return user data of given id
    // Else return all data
    var userId = data.id;
    if (userId) {
      var result = await User.findById(userId);
      if(result) {
        // If user if given id is exist
        return res.json(response(true, success, cleanObject(result._doc)));
      } else {
        // If user not exist
        return res.json(response(false, "User does not exist", {}));
      }
    }

    // Fetch all users
    var result = await User.find();
    result.map((e) => {
      cleanObject(e._doc);
    });
    return res.json(
      response(true, success, result)
    );
  } catch (error) {
    return res.status(InternalServerError).json(response(false, error.message));
  }
}

exports.addUser = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }

  // Delete all users
  //await User.deleteMany();

  try {
    const data = req.body;
    const newUser = User({
      user_name: data.user_name.trim(),
      password: data.password,
      email: data.email.trim(),
      mobile: data.mobile.trim(),
      country: data.country_id,
      gender: (data.gender || "unknown").toLowerCase(),
      dob: data.dob || null,
      country_id: data.country_id || null,
    });
    const result = await newUser.save();
    return res.json(
      response(true, success, cleanObject(result._doc))
    );
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.json(response(false, `There was a duplicate key : ${Object.keys(error.keyValue).join(', ')}`));
    }
    return res.status(InternalServerError).json(response(false, error.message));
  }
};

exports.deleteUser = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }

  try {
    // Get data from body
    const data = req.body;

    // Check user is exist or not
    var doesUserExist = await User.findById(data.id);
    console.log(doesUserExist);
    if (doesUserExist == null) {
      return res.json(response(false, "User does not exist", {}));
    }
    const result = await User.deleteOne({_id: data.id});
    if (result.deletedCount) {
      return res.json(response(true, success, {}));
    } else {
      return res.json(response(false, "Something went wrong", {}));
    }
    
  } catch (error) {
    console.log(error);
    return res.status(InternalServerError).json(response(false, error.message));
  }
};

exports.patchUser = async (req, res) => {
  if (!isValidRequest(req, res)) {
    return;
  }
  try {
    // Get data from body
    const data = req.body;

    // Check user is exist or not
    var doesUserExist = await User.findById(data.id);
    if (doesUserExist == null) {
      return res.json(response(false, "User does not exist", {}));
    }

    // Apply filter
    const filter = { _id: data.id };

    delete data.id;
    delete data._id;
    data.updated_at = Date.now();

    // Update data
    const result = await User.findOneAndUpdate(filter, data, {
      new: true,
    });

    // Return with updated data
    return res.json(response(true, success, cleanObject(result._doc)));
  } catch (e) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.json(response(false, "There was a duplicate key error"));
    }
    return res.status(InternalServerError).json(response(false, error.message));
  }
};

const { isValidRequest } = require("../common/request_validator");
const { response } = require("../common/response");
const { InternalServerError } = require("../common/status");
const { success } = require("../common/strings");
const AdminUser = require("../models/admin_user");
const { cleanObject } = require("../utils/object_helper");
const { moment } = require("moment");

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
    var email = data.email;
    var password = data.password;
    if (email && password) {
      var result = await AdminUser.findOne({email: email, password: password});
      if (result) {
        // If user is exist
        return res.json(response(true, `Login successfull`, {
          id: result._id,
          name: result.name,
          email: result.email,
        }));
      } 

      // If user not exist
      return res.json(response(false, `Invalid credentials`, {}));
    }
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
    const newUser = AdminUser({
      name: data.name,
      password: data.password,
      email: data.email,
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
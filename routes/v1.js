const express = require("express");
const router = express.Router();

//Validators
const { check, oneOf } = require("express-validator");

//Constants
const route = require("../constants/routes");

//Controllers
const userController = require("../controllers/user_controller");
const countryController = require("../controllers/country_controller");

router.get('/',(req,res) => {
    return res.json({name: "v1",status: "running"});
});

// User Route

router.post(route.getUser, [
    check("id").isMongoId().withMessage("invalid id").optional(),
], userController.getUser);

router.post(route.addUser, [
    check("user_name").notEmpty().withMessage("User name is required"),
    check("email").notEmpty().withMessage("Email is required"),
    check("email").isEmail().withMessage("Email is invalid"),
    check("mobile").notEmpty().withMessage("Mobile is required"),
    check("mobile").isMobilePhone().withMessage("Mobile is invalid"),
    check("password").notEmpty().withMessage("Password is required"),
], userController.addUser);

router.patch(route.editUser, [
    check("id").notEmpty().withMessage("id is required"),
    check("id").isMongoId().withMessage("id is invalid"),
    oneOf([
      check("user_name").notEmpty().withMessage("User name is required"),
    check("email").notEmpty().withMessage("Email is required"),
    check("mobile").notEmpty().withMessage("Mobile is required"),
    check("password").notEmpty().withMessage("Password is required"),
    ], 'No parameter found to update'),
], userController.patchUser);

router.post(route.deleteUser, [
  check("id").notEmpty().withMessage("id is required"),
  check("id").isMongoId().withMessage("id is invalid"),
], userController.deleteUser);

// Country Route
router.post(route.getCountry, [], countryController.getCountry);
router.post(
  route.country,
  [
    check("name", "name is Required").notEmpty(),
    check("code", "code is Required").notEmpty(),
    check("code", "Invalid Country Code").isLength({
      min: 2,
      max: 3,
    }),
    check("mobile_code", "mobile_code is Required").notEmpty(),
    check("mobile_code", "Mobile Code must be Number").isNumeric(),
    check("mobile_code", "Invalid Mobile Code").isLength({
      min: 1,
    }),
  ],
  countryController.addCountry
);
router.patch(
  route.country,
  [
    check("id").notEmpty(),
    oneOf(
      [
        check("name").notEmpty(),
        check("code", "Invalid Country Code").isLength({
          min: 2,
          max: 3,
        }),
        check("is_default").notEmpty(),
        check("flag").notEmpty(),
        check("status").notEmpty(),
        check("mobile_code", "Invalid Mobile Code").isLength({
          min: 1,
        }),
      ],
      "No parameters found to update"
    ),
  ],
  countryController.patchCountry
);

module.exports = router;
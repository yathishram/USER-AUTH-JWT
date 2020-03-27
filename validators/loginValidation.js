const validator = require("validator");
const isEmpty = require("is-empty");
const { model } = require("mongoose");

module.exports = validateLogin = data => {
  let errors = {};

  let { email, password } = data;

  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  if (validator.isEmpty(email)) {
    errors.email = "Email is required";
  }
  //isEmail is function of validator
  else if (!validator.isEmail(email)) {
    errors.email = "Enter a valid email id";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password is required";
  } else if (!validator.isLength(password, { min: 8, max: 30 })) {
    errors.password = "Password must be atleast 8 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

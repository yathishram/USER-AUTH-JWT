const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateSignUp = data => {
  let errors = {};

  let { user_name, email, password } = data;

  user_name = !isEmpty(user_name) ? user_name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  if (validator.isEmpty(user_name)) {
    errors.user_name = "User name is required";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Enter valid email id";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password is required";
  } else if (!validator.isLength(password, { min: 8, max: 30 })) {
    errors.password = "Password should be atleast 8 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

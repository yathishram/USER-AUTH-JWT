const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const secret = config.get("jwtSecret");

//passport.authenticate('jwt', {session:false}) use this as 2nd parameter to authenticate stuff

//dependecies
const router = express.Router();
const validateSignup = require("../validators/signupValidation");
const validateLogin = require("../validators/loginValidation");
const User = require("../models/User");

//Signup Route

router.post("/signup", (req, res) => {
  const { errors, isValid } = validateSignup(req.body);
  const { user_name, email, password } = req.body;
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  User.findOne({ $or: [{ email }, { user_name }] }).then(user => {
    if (user) {
      if (user.email === email) return res.status(400).json({ email: "Email already exists" });
      else return res.status(400).json({ user_name: "Username already exists" });
    } else {
      const newUser = new User({ user_name, email, password });
      //Hashpassword and save

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log({ error: "Error creating a new user" }));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  const { email, password } = req.body;

  if (!isValid) {
    res.status(400).json({ errors });
  }

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "Email not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          user_name: user.user_name
        };
        jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
          if (err) {
            console.log(err);
          }
          return res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;

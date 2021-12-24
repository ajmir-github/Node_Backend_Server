// imports
const express = require('express');
const {
  signUser,
  authToken
} = require("../controllers/auth/authController")


const router = express.Router()

//    /auth/...
router.post("/sign", signUser)

router.post("/token", authToken)

module.exports = router
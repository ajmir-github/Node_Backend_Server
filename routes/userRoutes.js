// imports
const express = require('express');
const {
  getAllUsers,
  getSingleUser,
  selectUserByIdParam,
  createUser,
  deleteUser,
  updateUser,
  uploadUserImage,
  followUser
} = require("../controllers/user/userController")

const { verfyUser } = require("../controllers/auth/authController")
const {
  canUpdateUser,
  canDeleteUser
} = require("../controllers/user/userRole")
const router = express.Router()

// DomainName/user/...

router.get("/", // get all users
  getAllUsers
)

router.get("/:id", // get a single user
  selectUserByIdParam,
  getSingleUser
)

router.post("/", // create a user
  createUser
)

router.patch("/:id", // update a user
  verfyUser,
  selectUserByIdParam,
  canUpdateUser,
  updateUser
)

router.delete("/:id", // delete a user
  verfyUser,
  selectUserByIdParam,
  canDeleteUser,
  deleteUser
)



router.post("/upload", // upload the profile photo
  verfyUser,
  uploadUserImage
)


router.post("/follow", // follow and unfollow a user
  verfyUser,
  followUser
)





module.exports = router
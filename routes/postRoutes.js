// imports
const express = require('express');
const {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  selectPostByIdParams,
  uploadPostImage,
  makeComment
} = require("../controllers/post/postController")
const { verfyUser } = require("../controllers/auth/authController")
const {
  canCreatePost,
  canUpdateAndDeletePost,
  canUploadPostImage
} = require("../controllers/post/postRole")

const router = express.Router()
// DomainName/post/

router.get("/", // get all posts
  getAllPosts 
)

router.get("/:id", // get a single post
  selectPostByIdParams,
  getSinglePost
)

router.post("/", // create a post
  verfyUser,
  canCreatePost,
  createPost
)

router.patch("/:id", // update a post
  verfyUser,
  selectPostByIdParams,
  canUpdateAndDeletePost,
  updatePost
)

router.delete("/:id", // delete a post
  verfyUser,
  selectPostByIdParams,
  canUpdateAndDeletePost,
  deletePost
)

router.post("/upload/:id", // upload post image file
  verfyUser,
  selectPostByIdParams,
  canUploadPostImage,
  uploadPostImage
)

router.post("/comment/:id", // add comment the post
  selectPostByIdParams,
  makeComment
)

module.exports = router
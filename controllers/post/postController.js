// imports
const { postModel } = require("../../models/postModel")
const { userModel } = require("../../models/userModel") 
const {
  getUniqueName,
  imageProcessor,
  fsSimple,
  jsSimple,
  statusCodes
} = require("../../utils")
const path = require('path');


exports.selectPostByIdParams = async (req, res, next)=>{
  // MIDDLEWARE SELECT A POST BY ID PARAM
  try {
    const foundPost = await postModel
      .findById(req.params?.id, "-__v")
    if(foundPost === null)
      throw {
        status:statusCodes.NOT_FOUND,
        message:"Post not found!"
      }
    res.selectedPost = foundPost
    next()
  } catch ({status, message}) {
    res.status(status || statusCodes.SERVER_ERROR).send(message)
  }
}



exports.getAllPosts = async (req, res)=>{
  // GET ALL POSTS
  try {
    const {
      limit,
      skip,
      include,
      sort,
      search
    } = req.query
    let query = {}
    if(typeof search !== "undefined"){
      query = {title:new RegExp(search, "ig")}
    }
    const foundPosts = await postModel
      .find(query, include || "-__v")
      .limit(+limit || 10)
      .skip(+skip || 0)
      .sort({date:+sort || -1})
    res.json(foundPosts)
  } catch ({message}) {
    res.status(statusCodes.SERVER_ERROR).send(message)
  }
}



exports.getSinglePost = (req, res)=>{
  // GET A SINGLE POST
  res.json(res.selectedPost)
}

exports.createPost = async (req, res)=>{
  // CREATE POST
  try {
    // create a post
    let newPost = jsSimple.cloneObject(req.body) // make it mut
    newPost.author = res.verfiedUser.fullName ;
    newPost.createdBy = res.verfiedUser._id;

    const postObject = new postModel(newPost);
    const createdPost = await postObject.save();
    // save post id into user posts history
    res.verfiedUser.postsId.push(createdPost["_id"])
    await res.verfiedUser.save()
    // 200 response
    res.json(createdPost)
  } catch ({message}) {
    res.status(statusCodes.BAD_REQUEST).send(message)
  }
}

exports.updatePost = async (req, res)=>{
  // UPDATE A POST
  try {
    for (const [key, value] of Object.entries(req.body))
      res.selectedPost[key] = value
    const updatedPost = await res.selectedPost.save()
    res.json(updatedPost)
  } catch ({message}) {
    res.status(statusCodes.SERVER_ERROR).send(message)
  }
}

exports.deletePost = async (req, res)=>{
  // DELETE A POST
  try {
    const imgs = res.selectedPost.image
    const postId = res.selectedPost._id
    const userId = res.selectedPost.createdBy
    
    await res.selectedPost.remove()
    const user = await userModel.findById(userId)
    user.postsId = user.postsId.filter(id => id.toString() !== postId.toString())
    await user.save()
    // collect the garbages
    fsSimple.deleteFiles([
      path.join("./", "public", "files", imgs.lgImg),
      path.join("./", "public", "files", imgs.smImg)
    ])

    res.send("Post deleted!")
  } catch ({message}) {
    res.status(statusCodes.SERVER_ERROR).send(message)
  }
}



exports.uploadPostImage = async (req, res) => {
  // Upload the image to image of the post
  const imageFile = req.files.image
  const fileName =  getUniqueName()
  const fileExt = fsSimple.getFileExt(imageFile.name)
  const tempImgPath = path.join("./", "public", "files", `temp.${fileExt}`)
  const lgImg = `${fileName}.${fileExt}`
  const smImg = `${fileName}.min.${fileExt}`
  const lgImgPath = path.join("./", "public", "files", lgImg)
  const smImgPath = path.join("./", "public", "files", smImg)
  const previousImgs = res.selectedPost.image

  try {  
    // Get the image from upload and save it
    await imageFile.mv(tempImgPath)
    await imageProcessor.resizeImage(tempImgPath, lgImgPath, {h:600, w:800})
    await imageProcessor.resizeImage(tempImgPath, smImgPath, {h:480, w:480})

    res.selectedPost.image = { lgImg, smImg }
    await res.selectedPost.save()
    // garbage collectors
    fsSimple.deleteFiles([
      tempImgPath,
      path.join("./", "public", "files", previousImgs.lgImg),
      path.join("./", "public", "files", previousImgs.smImg)
    ])

    res.json("Image uploaded!")
  } catch ({message, status}) {
    // garbage collectors
    fsSimple.deleteFiles([
      tempImgPath,
      lgImgPath,
      smImgPath
    ])
    res.status(status || statusCodes.SERVER_ERROR).send(message)
  }

}


exports.makeComment = async (req, res)=>{
  // APPEND A COMMENT TO A POST
  try {
    res.selectedPost.comments = [
      ...jsSimple.cloneObject(res.selectedPost.comments),
      jsSimple.cloneObject(req.body)
    ]
    await res.selectedPost.save()
    res.send("Comment is made successfully!")
  } catch ({message}) {
    res.status(statusCodes.BAD_REQUEST).send(message)
  }
}
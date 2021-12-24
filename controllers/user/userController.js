// imports
const { userModel } = require("../../models/userModel")
const {
  jsSimple,
  encrypt,
  fsSimple,
  getUniqueName,
  imageProcessor,
  statusCodes
} = require("../../utils")
const path = require("path")


exports.getAllUsers = async (req, res)=>{
  // GET ALL USERS
  try {
    const users = await userModel.find({},"-__v -password")
    res.json(users)
  } catch ({message}) {
    res.status(statusCodes.SERVER_ERROR).send(message)
  }
}

exports.selectUserByIdParam = async (req, res, next)=>{
  try {
    const foundUser = await userModel.findById(req.params?.id);
    if(foundUser === null)
      throw {
        status:statusCodes.NOT_FOUND,
        message:"User not found!"
      }
    res.selectedUser = foundUser;
    next();
  } catch ({status, message}) {
    res.status(status || statusCodes.BAD_REQUEST).send(message);
  }
}

exports.getSingleUser =  (req, res)=>{
  // GET A SINGLE USER
  res.json(jsSimple.excludeFromObject(res.selectedUser, "password __v"))
}

exports.createUser = async (req, res)=>{
  // CREATE A USER
  try {
    const foundUser = await userModel.findOne({username:req.body?.username})
    if(foundUser !== null)
      throw {
        status:statusCodes.BAD_REQUEST,
        message:"This user has already created!"
      } 
    if(typeof req.body?.password !== "undefined"){
      req.body.password = await encrypt.hash(req.body.password)
    }
    const newUser = new userModel({...req.body})
    const savedUser = await newUser.save()
    res.json(savedUser)
  } catch ({status, message}) {
    res.status(status || statusCodes.BAD_REQUEST).send(message)
  }
}

exports.deleteUser = async (req, res)=>{
  // DELETE A USER
  try {
    const imgs = res.verfiedUser?.image
    await res.selectedUser.remove();
    // garbage collector
    fsSimple.deleteFiles([
      `./public/files/${imgs.lgImg}`,
      `./public/files/${imgs.smImg}`
    ])
  
    res.json("User deleted")
  } catch ({message}) {
    res.status(statusCodes.SERVER_ERROR).send(message)
  }
}


exports.updateUser = async (req, res)=>{
  // UPDATE A USER
  try {
    if(typeof req.body?.password !== "undefined"){
      req.body.password = await encrypt.hash(req.body.password)
    }
    for (const [key, value] of Object.entries(req.body))
      res.selectedUser[key] = value
    const updatedUser = await res.selectedUser.save()
    res.send(updatedUser)
  } catch ({message}) {
    res.status(statusCodes.SERVER_ERROR).send(message)
  }
}



exports.uploadUserImage = async (req, res, next)=>{
  // Upload image to profilePhoto of the user
  const imageFile = req.files.image
  const fileName =  getUniqueName()
  const fileExt = fsSimple.getFileExt(imageFile.name)
  const tempImgPath = path.join("./", "public", "files", `temp.${fileExt}`)
  const lgImg = `${fileName}.${fileExt}`
  const smImg = `${fileName}.min.${fileExt}`
  const lgImgPath = path.join("./", "public", "files", lgImg)
  const smImgPath = path.join("./", "public", "files", smImg)
  const previousImgs = res.verfiedUser.image

  try {
    // Get the image from upload and save it
    await imageFile.mv(tempImgPath)
    await imageProcessor.resizeImage(tempImgPath, lgImgPath, {h:512, w:512}),
    await imageProcessor.resizeImage(tempImgPath, smImgPath, {h:128, w:128})
   
    res.verfiedUser.image = { lgImg, smImg }
    await res.verfiedUser.save()
    // garbage collector
    fsSimple.deleteFiles([
      tempImgPath,
      path.join("./", "public", "files", previousImgs.lgImg),
      path.join("./", "public", "files", previousImgs.smImg),
    ])

    res.json("Image uploaded!")
  } catch ({message}) {
    // garbage collector
    fsSimple.deleteFiles([
      tempImgPath,
      lgImgPath,
      smImgPath
    ])
    res.status(statusCodes.SERVER_ERROR).send(message)
  }

}





exports.followUser = async (req, res)=>{
  try {
    const { follow, userId } = req.body;
    if (typeof(follow) === "undefined" || typeof(userId) === "undefined")
      throw {
        status:statusCodes.BAD_REQUEST,
        message:"'follow' or 'userId' is missing!"
      }
    let followedIds = jsSimple.cloneObject(res.verfiedUser.followedUsersId);
    let isIdFollowed = followedIds.some(id=> id.toString() === userId.toString());
    let resMsg = "";
    if(follow){
      if(isIdFollowed){
        throw {
          status:statusCodes.BAD_REQUEST,
          message:"'This userId is already followed!"
        }
      } else {
        followedIds.push(userId);
        resMsg = `user with the id ${userId} followed!`;
      }
    } else {
      if(isIdFollowed){
        followedIds = followedIds.filter(id => id.toString() !== userId.toString());
        resMsg = `user with the id ${userId} unfollowed!`;
      } else {
        throw {
          status:statusCodes.BAD_REQUEST,
          message:"'This userId is not followed at all!"
        }
      }
      
    }
    res.verfiedUser.followedUsersId = followedIds;
    await res.verfiedUser.save();
    res.send(resMsg)
  } catch ({status, message}) {
      res.status(status || statusCodes.SERVER_ERROR).send( message || "Following user has failed!")
  }
}
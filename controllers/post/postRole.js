// ROLES
// 0 = deactive
// 1 = root
// 2 = admin
// 3 = user

const {
  statusCodes
} = require('../../utils');


exports.canCreatePost = (req, res, next)=>{
 const { role } = res.verfiedUser;
 // root, admin, user
 if (role === 1 || role === 2 || role === 3) {
   next();
 } else {
   res.status(statusCodes.NOT_AUTHORIZED).send("Deactive users are not allowed to create a post!");
 }
}

exports.canUpdateAndDeletePost = (req, res, next)=>{
 const { role } = res.verfiedUser;
 if (role === 1 || role === 2) {
   next();
 } else if(role === 3){
   const userId = res.verfiedUser?._id.toString();
   const postById = res.selectedPost?.createdBy.toString();
   if(userId === postById){
     next();
   } else {
     res.status(statusCodes.NOT_AUTHORIZED).send("This user is not allowed to update this post!");
   }
 } else {
   res.status(statusCodes.NOT_AUTHORIZED).send("Access denied!");
 }
}


exports.canUploadPostImage = (req, res, next)=>{
 const role = res.verfiedUser.role
 if (role === 1 || role === 2) {
   next()
 } else if(role === 3){
   const userId = res.verfiedUser?._id.toString()
   const postById = res.selectedPost?.createdBy.toString()
   if(userId === postById){
     next()
   } else {
     res.status(statusCodes.NOT_AUTHORIZED).send("This user is not allowed to update this post!")
   }
 } else {
   res.status(statusCodes.NOT_AUTHORIZED).send("Access denied!")
 }
}


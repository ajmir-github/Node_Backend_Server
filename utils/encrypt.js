const bcrypt = require("bcryptjs")


// hash using bcryptjs and handle unexpected errors
exports.hash = (password) =>
  new Promise(async(resolve, reject)=>{
  try{
   resolve(await bcrypt.hash(password, 10))
  } catch (err){
   reject({message:"bcryptjs has failed to hash"})
  }
 });


// match the password using bcryptjs and handle unexpected errors
exports.match = (password, hashPassword) =>
  new Promise(async(resolve, reject)=>{
  try{
   resolve(await bcrypt.compare(password, hashPassword))
  } catch (err){
   reject({message:"bcryptjs has failed to match the password with the hash"})
  }
 });
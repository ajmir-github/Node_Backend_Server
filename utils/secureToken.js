const jwt = require('jsonwebtoken');

const tokenSecertKey = process.env.JWT_SECRET_KEY || "secure_token"

// Sign secure token for auth
const sign = (data, secertKey = tokenSecertKey) =>
  new Promise((resolve, reject)=>{
    try {
      resolve(jwt.sign(data, secertKey))
    } catch (error) {
      reject({message:"Failed to sign a token!"})
    }
  })


// verfy token for auth
const verfy = (token, secertKey = tokenSecertKey) =>
  new Promise((resolve, reject)=>{
    try {
      resolve(jwt.verify(
        token,
        secertKey
      ))
    } catch (error) {
      reject({message:"Invalid token was provided!"})
    }
  })

module.exports = {
  sign, verfy
}
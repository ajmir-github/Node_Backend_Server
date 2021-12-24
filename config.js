// imports
const path = require("path")
const { userModel } = require("./models/userModel")
const dotenv = require('dotenv');
const {
 database,
 fsSimple,
 encrypt,
 processSimple
} = require("./utils")

// Get env vars
dotenv.config("./.env")


const setup = ()=>
 // connect to database
 database(process.env.DATABASE_URL, async ()=>{
  console.log('--- Config Setup');
  try {
   // get config.json
   const rootUser = await fsSimple.readJSON(path.join(__dirname, "utils", "config.json"))
   // Create dirs
   await fsSimple.createFolder(path.join(__dirname, "public",  "files"))
   // check if root user created
   const hasRootUser = await userModel.findOne({
    username:rootUser.username
   })
   if(hasRootUser !== null)
    throw {message:"+++ Root user is already created!"}
   // hash password
   const password = await encrypt.hash(rootUser.password)
   // // create root user
   const root = new userModel({...rootUser, password})
   // // save it
   await root.save()
   console.log("--- Root user has created!")
  } catch ({message}) {
   console.log(message || "+++ Failed to create Root user!")
  } finally {
   processSimple.exitProgram() // terminate the program
  }
 })


const reset = ()=>
 // connect to database
 database(process.env.DATABASE_URL, async ()=>{
  console.log('--- Config Reset');
  try {
   // get config.json
   const rootUser = await fsSimple.readJSON(path.join(__dirname, "utils", "config.json"))
   // Create dirs
   await fsSimple.createFolder(path.join("public", "files"))
   // check if root user created
   const hasRootUser = await userModel
    .findOne({username:rootUser.username})
   if(hasRootUser !== null){
    await userModel
     .findOneAndDelete({username:rootUser.username})
    console.log("--- Previous root user is deleted!");
   } 
   // hash password
   const password = await encrypt.hash(rootUser.password)
   // // create root user
   const root = new userModel({...rootUser, password})
   // // save it
   await root.save()
   console.log("--- New root user has created!")
  } catch ({message}) {
   console.log(message || "+++ Failed to create Root user!")
  } finally {
   processSimple.exitProgram() // terminate the program
  }
 })


// Get env arguments
const [ nodePath, filePath, command, data ] = process.argv
if(typeof command === "undefined"){
 setup()
} else if(command === "reset"){
 reset()
}
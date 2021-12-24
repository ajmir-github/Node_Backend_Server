const fs = require('fs');


// deleteFile
const deleteFile = (fileName, throwError =  false) =>
 new Promise(async(resolve, reject)=>{
  fs.unlink(fileName, (err)=>{
   if(err && throwError) reject({message:"Failed to delete!", error:err})
   if(err){
    resolve("Failed to delete!")
   } else {
    resolve("Deleted!")
   }
  })
 })

// deleteFiles
const deleteFiles = (fileNames, throwError =  false) =>
  Promise.all(
    fileNames.map(fileName => deleteFile(fileName, throwError))
  )


// createFolder
const createFolder = (path, throwError =  false) =>
  new Promise(async(resolve, reject)=>{
    fs.mkdir(path, (err)=>{
      if(err && throwError) reject({message:"Failed to create!", error:err})
      if(err){
        resolve("Failed to create!")
      } else {
        resolve("Folder created!")
      }
   })
  })

// readJSON
const readJSON = (path, throwError =  false) =>
  new Promise(async(resolve, reject)=>{
    fs.readFile(path, (err, buffer)=>{
      if(err && throwError) reject({message:"Failed to read!", error:err})
      if(err){
        resolve("Failed to read!")
      } else {
        resolve(JSON.parse(buffer.toString()))
      }
   })
  })


  // Get file's extensions
const getFileExt = (fileName) =>
  fileName.split(".").reverse()[0]



module.exports = {
    deleteFile, deleteFiles, createFolder, readJSON, getFileExt
}
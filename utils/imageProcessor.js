const Jimp = require('jimp');


// Read, resize and make the image better and save it in a new path
const resizeImage = (exFilePath, newFilePath, size = {w:320, h:240}, quality = 75, contrast = 0.05) =>
  new Promise(async(resolve, reject)=>{
  try {
   const imgFile = await Jimp.read(exFilePath)
   imgFile
   .cover(size.w, size.h)
   .quality(quality)
   .contrast(contrast)
   .write(newFilePath, (err)=>{
     if(!err){
       resolve("Resized image saved!")
     } else {
       reject({message:"Failed to resize the image!"})
     }
   })
  } catch (err) {
   reject({message:"Failed to read the image!"})
  }
 }) 


module.exports = {
    resizeImage
}
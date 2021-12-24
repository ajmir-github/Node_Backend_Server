// clone for having pure functionality
const cloneObject = (object) =>
  JSON.parse(JSON.stringify(object))

// exclude keys from an object
const excludeFromObject = (object, keys, splitBy = " ") => {
 let newObj = cloneObject(object)
 for (const key of keys.split(splitBy))
  delete newObj[key]
 return newObj
}


module.exports = {
  cloneObject,
  excludeFromObject,
}
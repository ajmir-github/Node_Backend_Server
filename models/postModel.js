const mongoose = require('mongoose');

// const commentSchema = {
//   author:{
//     type:String,
//     required:true
//   },
//   body: {
//     type:String,
//     required:true
//   },
//   email: {
//     type:String,
//     required:true
//   },
//   date:{
//     type:Date,
//     default:Date.now
//   },
// }

const postSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  keywords:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  body: {
    type:String,
    required:true
  },
  image: {
    type: Object,
    default: {
      lgImg:{
        type:String,
        default:null
      },
      smImg:{
        type:String,
        default:null
      }
    }
  },
  comments:[ {
    author:{
      type:String,
      required:true
    },
    body: {
      type:String,
      required:true
    },
    email: {
      type:String,
      required:true
    },
    date:{
      type:Date,
      default:Date.now
    },
  } ],
  date:{
    type:Date,
    default:Date.now
  },
  createdBy:{
    type:mongoose.SchemaTypes.ObjectId,
    required:true
  }
})

exports.postModel = mongoose.model("post", postSchema)
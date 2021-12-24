const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  postsId: [
    mongoose.SchemaTypes.ObjectId
  ],
  followedUsersId: [
    mongoose.SchemaTypes.ObjectId
  ],
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
  role: {
    type: Number,
    default: 0 // 0 = deactive, 1 = root,  2 = admin, 3= user
  },
  date: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
});

exports.userModel = mongoose.model("user", userSchema);
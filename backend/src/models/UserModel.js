const mongoose = require("mongoose");
 const UserModelName = "Users"

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  name: { type: String },
  email: {  type: String },
  password: {type: String, default: ''},
  mobile: { type: String },
  role: { type: String },
  active: { type: Boolean, default: true },
  imageUrl:{type:String, default:'https://res.cloudinary.com/dwf0svqiw/image/upload/v1690445272/user_beuhg4.avif'}
},
{ 
  timestamps: true,
  collection: UserModelName 
}
);


module.exports = mongoose.model(UserModelName, UserSchema);

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
  imageUrl:{type:String}
},
{ 
  timestamps: true,
  collection: UserModelName 
}
);


module.exports = mongoose.model(UserModelName, UserSchema);

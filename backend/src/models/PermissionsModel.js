const mongoose = require("mongoose");
 const PermissionsModelName = "Permissions"

const Schema = mongoose.Schema;

let PermissionsSchema = new Schema({
  name: { type: String },
  description: {type: String}
},
{ 
  timestamps: true,
  collection: PermissionsModelName 
}
);


module.exports = mongoose.model(PermissionsModelName, PermissionsSchema);

const mongoose = require('mongoose');
const RolesModelName = "Roles"
const RolesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   permissions: [{type : String}],
   description: {type: String, default: null}
  },
  {
    timestamps: true,
    collection: RolesModelName,
  }
);

module.exports =  mongoose.model(RolesModelName, RolesSchema);


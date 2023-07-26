const mongoose = require('mongoose');
const RolesModelName = "Roles"
const RolesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roleList: {
      type: Boolean,
      default: false,
    },
    roleCreate: {
      type: Boolean,
      default: false,
    },
    roleEdit: {
      type: Boolean,
      default: false,
    },
    roleDelete: {
      type: Boolean,
      default: false,
    },
    ownerList: {
      type: Boolean,
      default: false,
    },
    ownerCreate: {
      type: Boolean,
      default: false,
    },
    ownerEdit: {
      type: Boolean,
      default: false,
    },
    ownerDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: RolesModelName,
  }
);

module.exports =  mongoose.model(RolesModelName, RolesSchema);


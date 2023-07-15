const mongoose = require("mongoose");
 const BuildingModelName = "Buildings"

const Schema = mongoose.Schema;

let BuildingSchema = new Schema({
  owner: { type: String},
  code: { type: String },
  name: { type: String },
  phase: {  type: String },
  address: {type: String },
  city: {type: String },
  dues: { type: Number, default: 0},
  dueDays: { type: Number, default: 0},
},
{ 
  timestamps: true,
  collection: BuildingModelName 
}
);


module.exports = mongoose.model(BuildingModelName, BuildingSchema);

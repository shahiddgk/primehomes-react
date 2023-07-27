const mongoose = require("mongoose");
 const AmenityModelName = "Amenities"

const Schema = mongoose.Schema;

let AmenitySchema = new Schema({
  name: { type: String },
  dues: { type: Number, default: 0},
  charges: { type: String},
},
{ 
  timestamps: true,
  collection: AmenityModelName 
}
);


module.exports = mongoose.model(AmenityModelName, AmenitySchema);

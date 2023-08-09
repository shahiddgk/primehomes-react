const mongoose = require("mongoose");
 const OccupantsModelName = "Occupants"

const Schema = mongoose.Schema;

let OccupantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userId: { type: Schema.Types.ObjectId },
  mobile: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: false,
  },
  approved: { type: Boolean, default: false },
},
{ 
  timestamps: true,
  collection: OccupantsModelName 
}
);


module.exports = mongoose.model(OccupantsModelName, OccupantSchema);

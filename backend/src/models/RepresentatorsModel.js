const mongoose = require("mongoose");
 const RepresentativeModelName = "Representatives"

const Schema = mongoose.Schema;

let RepresentativesSchema = new Schema({
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
},
{ 
  timestamps: true,
  collection: RepresentativeModelName 
}
);


module.exports = mongoose.model(RepresentativeModelName, RepresentativesSchema);

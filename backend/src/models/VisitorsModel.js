const mongoose = require("mongoose");
 const VisitorsModelName = "Visitors"

const Schema = mongoose.Schema;

let VisitorsSchema = new Schema({
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
  status: {type: String, default: 'pending', enum: ['pending', 'approved', 'suspended']},
  image: {
    type: String, 
    required: true,
  },
  active: {type:Boolean, default:true}
},
{ 
  timestamps: true,
  collection: VisitorsModelName 
}
);


module.exports = mongoose.model(VisitorsModelName, VisitorsSchema);

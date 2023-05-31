const mongoose = require("mongoose");
const LeaseModelName = "Lease"


const Schema = mongoose.Schema;

let LeaseSchema = new Schema({
  startDate: { type: String},
  endDate: { type: String},
  building: { type: Schema.Types.ObjectId, ref: 'Buildings', default: {} },
  unit: { type: String},
  leaseType: { type: String},
  tenant: { type: Schema.Types.ObjectId, ref: 'People', default: {} },
  accuntStatus: { type: Boolean, defult: false},
  amenities: { type: Boolean, defult: false},
  leaseContract: { type: Object, default: {}},
  identity: { type: Object, default: {}},
  otherDoc1: { type: Object, default: {}},
  otherDoc2: { type: Object, default: {}},
  personalDetails: { type: Array, default: [] },
},
{ 
  timestamps: true,
  collection: LeaseModelName 
}
);


module.exports = mongoose.model(LeaseModelName, LeaseSchema);

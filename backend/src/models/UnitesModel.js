const mongoose = require("mongoose");
const UnitsModelName = "Units"


const Schema = mongoose.Schema;

let UnitsSchema = new Schema({
  building: { type: Schema.Types.ObjectId, ref: 'Buildings', default: {} },
  tenant: { type: Schema.Types.ObjectId, ref: 'People', default: {} },
  unitNo: { type: String},
  unitType: { type: String},
  floorArea: { type: Number },
  isParking: { type: Boolean },
  slotNo: { type: Number },
  parkingArea: { type: Number },
  parkingLocation: { type: String },
  isFullyPaid: { type: Boolean },
  waterMeterNo: { type: Number }
},
{ 
  timestamps: true,
  collection: UnitsModelName 
}
);


module.exports = mongoose.model(UnitsModelName, UnitsSchema);

const mongoose = require("mongoose");
const PeopleModelName = "People"


const Schema = mongoose.Schema;

let PeopleSchema = new Schema({
  type: { type: String, enum : ['Owner','Tenant'], default: 'Owner' },
  code: { type: String},
  title: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  primaryEmail: { type: String },
  secondaryEmail: { type: String },
  alternateEmail: { type: String },
  landline: { type: String },
  primaryMobile: { type: String },
  secondaryMobile: { type: String },
  isAuthorized : { type: Boolean}
},
{ 
  timestamps: true,
  collection: PeopleModelName 
}
);


module.exports = mongoose.model(PeopleModelName, PeopleSchema);

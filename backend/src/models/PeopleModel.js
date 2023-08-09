const mongoose = require("mongoose");
const PeopleModelName = "People"


const Schema = mongoose.Schema;

let PeopleSchema = new Schema({
  type: { type: String, enum : ['Owner','Tenant'], default: 'Owner' },
  code: { type: String},
  title: { type: String},
  password: {type: String, default: ''},
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  primaryEmail: { type: String },
  secondaryEmail: { type: String },
  alternateEmail: { type: String },
  landline: { type: String },
  primaryMobile: { type: String },
  secondaryMobile: { type: String },
  isAuthorized : { type: Boolean},
  representatives : [
    {type: Schema.Types.ObjectId, ref:'Representatives'}
],
  visitors : [
    {type: Schema.Types.ObjectId, ref:'Visitors'}
],
  occupants : [{type: Schema.Types.ObjectId}],
},
{ 
  timestamps: true,
  collection: PeopleModelName 
}
);


module.exports = mongoose.model(PeopleModelName, PeopleSchema);

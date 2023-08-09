const mongoose = require("mongoose");
 const AnouncementModelName = "Announcements"

const Schema = mongoose.Schema;

let AnouncemnetSchema = new Schema({
  title: { type: String },
  description: { type: String},
  announcementType: { type: String},
  imageUrl: { type: String},
  audience: [{type : String}]
},
{ 
  timestamps: true,
  collection: AnouncementModelName 
}
);


module.exports = mongoose.model(AnouncementModelName, AnouncemnetSchema);

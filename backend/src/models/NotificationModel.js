const mongoose = require('mongoose')
const notificationModelName = 'Notifications'
const Schema = mongoose.Schema

let notificationSchema  = new Schema({
    notification: { type: Object },
    userId: { type: Schema.Types.ObjectId },
    data: { type: Schema.Types.ObjectId },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread',
    },
    type: {
        type: String, // Debate, Message, etc...
    },
    metadata: { // For Modifying Notification Like Reaction And Comment Notification
        type: Object, default: {}
    }
},
{
    versionKey: false,
    timestamps : true,
    collection : notificationModelName
}
)

module.exports = mongoose.model(notificationModelName, notificationSchema)

const NotificationModel = require('../models/NotificationModel')

const NOTIFICATION_READ_STATUS = 'read'
const NOTIFICATION_UNREAD_STATUS = 'unread'
const DEFAULT_PRIORITY = 'high'
const DEFAULT_SOUND = 'default'


const NOTIFICATION_TYPE = {
    annoucement: 'announcement',
    user: 'Users',
    chat: 'Chats',
}


const storeNotification = async (data, notification, type,userId) => {
    return await NotificationModel.create({data, notification, data, type, metadata: NOTIFICATION_TYPE.annoucement,userId});
}

const findOneByObj = async(obj) =>{
    try {
        return await NotificationModel.findOne(obj)
    } catch {
        return null
    }
}

const updateNotification = async (notificationID, payload) => {
    return await NotificationModel.findOneAndUpdate({_id: notificationID}, {$set: payload}, {new: true, upsert: true})
}

const getAllNotification = async (userId, page = 1, limit = 15) => {
    try {
      return await NotificationModel.find({userId}, {userId: 0})
    } catch (e) {
      console.log('Error:::', e);
      return null
    }
}

const getUnreadCountById = async (userId) => {
    try {
      return await NotificationModel.countDocuments({userId, status: NOTIFICATION_UNREAD_STATUS })
    } catch (e) {
      console.log(`[NotificationRepo:getNotReadCountById] userId [${userId}], error:`, e)
      return false
    }
}

const markAsRead = async (_id) => {
    await NotificationModel.findOneAndUpdate({_id}, {$set: {status: 'read'}}, {new: true})
}

const deleteNotification = async (notificationID) => {
    await NotificationModel.findOneAndDelete({_id: notificationID})
}





module.exports = {
    NOTIFICATION_READ_STATUS,
    NOTIFICATION_UNREAD_STATUS,
    DEFAULT_SOUND,
    DEFAULT_PRIORITY,
    NOTIFICATION_TYPE,
    storeNotification,
    findOneByObj,
    updateNotification,
    getUnreadCountById,
    markAsRead,
    getAllNotification,
    deleteNotification,

}
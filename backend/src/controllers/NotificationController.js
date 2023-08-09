const NotificationRepo = require('../repo/NotificationRepo')

const { socketUpdateNotificationCount, socketUpdateNotificationList } = require('../services/Socket');
const { badRequest, successResponse } = require('../config/responceHandler')
const { findAllUsers } = require('../repo/UserRepo')
const UserModel = require('../models/UserModel')
const PeopleModel = require('../models/PeopleModel')

const getUserNotification = async (req, res, next) => {
    try {
        const { _id } = req.userData
        const page = req.query.page < 1 ? 1 : req.query.page
        const notifications = await NotificationRepo.getAllNotification(_id, page)
        successResponse(res, 'Getting Notifications', notifications)
    }
    catch (err) {
        next(err)
    }
}

const getNotificationCount = async (req, res, next) => {
    try {
        const { _id } = req.userData
        const notifications = await NotificationRepo.getUnreadCountById(_id)
        successResponse(res, 'Getting Notification Count', notifications)
    }
    catch (err) {
        next(err)
    }
}

const markAsRead = async (req, res, next) => {
    try {
        const { notificationID } = req.params
        if (!notificationID) {
            return badRequest(res, 'Please Provide The Required Data With The Request!', [])
        }

            const Notification = await NotificationRepo.findOneByObj({_id:notificationID})
        if (!Notification) {
            return badRequest(res, 'No matching ID found', [], 404)
        }
        await NotificationRepo.markAsRead(notificationID)
        successResponse(res, `Message ${notificationID} Marked As Read.`, [], 202)
    } catch (err) {
        next(err)
    }
}

const deleteNotification = async (req, res, next) => {
    try {
        const { notificationID = '' } = req.params
        const Notification = await NotificationRepo.findOneByObj({ _id: notificationID })
        if (!Notification) {
            return badRequest(res, 'In-Correct Notification ID!', [], 404)
        }

        await NotificationRepo.deleteNotification(notificationID)
        successResponse(res, 'Notification is Deleted Successfully.', [])
    } catch (err) {
        next(err)
    }
}

const createNotification = async (data, title, description, imageUrl, announcementType, audience, req) => {
    
    let notification = {}
    notification = {
        title,
        description,
        imageUrl
    }
    if (audience.length === 1 && audience[0] === 'all') {
        const allUsers = findAllUsers();
        (await allUsers).map(async (user) => {
            const { _id } = user;
            const Notification = await NotificationRepo.storeNotification(data, notification, announcementType, _id)
            if (!Notification) {
                console.log('Something went wrong for creating notification')
                return;
            }
            await socketUpdateNotificationCount(req,_id.toString())
            await socketUpdateNotificationList(req, _id.toString())
            console.log('Notification created successfully');
            return;
        })
        return
    }
    const formatedAudience = JSON.parse(audience)
    const userRoles = formatedAudience.filter(role => role !== 'Owner' && role !== 'Tenant');
    const peopleTypes = formatedAudience.filter(type => type === 'Owner' || type === 'Tenant');
    
    const userQuery = { role: { $in: userRoles } };
    const peopleQuery = { type: { $in: peopleTypes } };
    const combinedQuery = { $or: [userQuery, peopleQuery] };

    const Users = Promise.all([
        UserModel.find(combinedQuery),
        PeopleModel.find(peopleQuery),
    ])
    const usersArray = await Users;
    if (!usersArray) {
        console.log('Something went wrong for creating notification')
        return;
    }

         usersArray.forEach(async (user) => {
        user.forEach(async (x) => {
            const { _id } = x;
            const Notification = await NotificationRepo.storeNotification(data, notification, announcementType, _id)
            if (!Notification) {
                console.log('Something went wrong for creating notification')
                return;
            }
           await socketUpdateNotificationCount(req,_id.toString())
           await socketUpdateNotificationList(req, _id.toString())
            console.log('Notification created successfully');
            return;
        })
        })   
        
    return;

}


module.exports = {
    getUserNotification,
    getNotificationCount,
    markAsRead,
    deleteNotification,
    createNotification
}

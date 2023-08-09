const NotificationRepo = require('../repo/NotificationRepo')
const EndPoints = {
    updateNotificationCount: 'updateNotificationCount',
    updateNotificationList: 'updateNotificationList'
}


const getClients = async (req, userID) => {
    console.log('11111111');
    const io = req.app.get('io')
    console.log('22222222');
    const redis = req.app.get('redis')
    const socketID = await redis.get(userID)
    return [io, socketID]
}


const socketUpdateNotificationCount = async (req, userID) => {
    try{
        console.log('socket1', userID)
        const [io, socketID] = await getClients(req, userID)
        const Notification = await NotificationRepo.getUnreadCountById(userID)       
        io.to(socketID).emit(EndPoints.updateNotificationCount, {Notification})
    }catch(err){
        throw new Error(err)
    }
}

const 
socketUpdateNotificationList = async (req, userID) => {
    try{
        console.log('socket2')

        const [io, socketID] = await getClients(req, userID)
        const Notification = await NotificationRepo.getAllNotification(userID, 1, 1)      
      
        io.to(socketID).emit(EndPoints.updateNotificationList, Notification)
    }catch(err){
        throw new Error(err)
    }
}



module.exports = {
    socketUpdateNotificationCount,
    socketUpdateNotificationList,
}

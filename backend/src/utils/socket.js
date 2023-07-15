const http = require('http')
const {Server} = require('socket.io')
const createServer = require('./server')
const {findOneByObject} = require('../repo/UserRepo');

const app = createServer()
app.server = http.createServer(app)


// Socket IO
const io = new Server(app.server, { maxHttpBufferSize: 1e8 })
app.set('io', io)
io.on('connection', async (socket) => {
  const {userId} = socket.handshake.query 
  const User = await findOneByObject({_id:  userId})
  if(!User){
    console.log('Invalid User!');
    socket.emit('invalid', 'Invalid User ID!')
    return socket.disconnect()
  }

  console.log(`${User.name} having ID: ${User._id} is connected with SID: ${socket.id}`)
  await redisClient.set(User._id.toString(), socket.id)


  socket.on('disconnect', async () => {
    console.log('User Disconnected:', userId);
  })


})

module.exports = app
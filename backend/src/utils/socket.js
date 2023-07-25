const http = require('http')
const {Server} = require('socket.io')
const createServer = require('./server')
const {findOneByObject} = require('../repo/UserRepo');
const cors = require('cors');

const app = createServer()


app.server = http.createServer(app)


// Socket IO
const io = new Server(app.server, { maxHttpBufferSize: 1e8 ,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'], // Add other HTTP methods if needed
  }
})
app.set('io', io)
io.on('connection', async (socket) => {
  const {userId} = socket.handshake.query 
  const User = await findOneByObject({_id:  userId})
  if(!User){
    console.log('Invalid User!');
    socket.emit('invalid', 'Invalid User ID!')
    return socket.disconnect()
  }
  socket.on("ping", (data) => {
    console.log(data);
    socket.emit('invalid', 'Something New')
  });

  console.log(`${User.name} having ID: ${User._id} is connected with SID: ${socket.id}`)
 


  socket.on('disconnect', async () => {
    console.log('User Disconnected:', userId);
  })


})

module.exports = app
const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

// remove new Socket later
const socketController = async (socket = new Socket(), io ) => {

  // const token = socket.handshake.headers['x-token']; // validate the token
  const user = await checkJWT(socket.handshake.headers['x-token']);
  if (!user) {
    return socket.disconnect();
  }

  // connect to an special room chat
  socket.join(user.id);

  // send last messages to a new client
  socket.emit('receive-messages', chatMessages.last10)
  // console.log(user.name, 'is connected...');

  // add connected user
  chatMessages.connectUser(user);
  io.emit('active-users', chatMessages.usersArr);

  // clean when user disconnect
  socket.on('disconnect', () => {
    chatMessages.disconnectUser(user.id);
    io.emit('active-users', chatMessages.usersArr);
  })

  // listen to sent messages
  socket.on('send-message', ({ uid, message }) => {
  
    if (uid) {
      // private message
      socket.to(uid).emit('private-message', { from: user.name, message })

    } else {
      chatMessages.sendMessage(user.id, user.name, message);
      io.emit('receive-messages', chatMessages.last10)
    }

  })

}

module.exports = {
  socketController,
}
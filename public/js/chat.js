const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:4000/api/auth'
            : 'https://restserver-node-jarh.herokuapp.com/api/auth';

let user = null;  // user information
let socket = null;  // socket information

// HTML references
const txtUid     = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers    = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnOut     = document.querySelector('#btnOut');


// validate token fron localstorage
const validateJWT = async () => {
  const token = localStorage.getItem('token') || '';

  if (token.length <= 10) {
    window.location = 'index.html'; // can use other methods using a framework
    throw new Error('There is no valid token in localStorage');
  }

  const resp = await fetch(url, {
    headers: { 'x-token': token }
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  // console.log(userDB, tokenDB);
  localStorage.setItem('token', tokenDB); // renew the previous token
  user = userDB;

  // the user is validated already
  document.title = user.name;

  await socketConnect(); // runs only when token is valid
  
}

const socketConnect = async () => {
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token')
    }
  });
  
  socket.on('connect', () => {
    console.log('Socket is online')
  });

  socket.on('disconnect', () => {
    console.log('Socket is offline')
  });

  socket.on('receive-messages', drawMessages);

  socket.on('active-users', drawUsers);

  socket.on('private-message', (payload) => {
    //TODO
    console.log(payload);
  });

}

const drawUsers = (users = []) => {
  let usersHtml = '';
  users.forEach(({ name, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `
  });

  ulUsers.innerHTML = usersHtml;

}

const drawMessages = (messages = []) => {
  let messagesHtml = '';
  messages.forEach(({ name, message }) => {
    messagesHtml += `
      <li>
        <p>
          <span class="text-primary">${name}</span>
          <span>${message}</span>
        </p>
      </li>
    `
  });

  ulMessages.innerHTML = messagesHtml;

}


txtMessage.addEventListener('keyup', ({ keyCode }) => {

  const message = txtMessage.value;
  const uid = txtUid.value;

  // keyCode 13  is equal o "enter"
  if (keyCode !== 13) { return; }
  // empty message
  if (message.length === 0) { return; }

  socket.emit('send-message', { message, uid });

  txtMessage.value = '';
})

const main = async () => {
  
  await validateJWT();
}

main();
// const socket = io();

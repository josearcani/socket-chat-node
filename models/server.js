const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth:       '/api/auth',
      categories: '/api/categories',
      products:   '/api/products',
      search:     '/api/search',
      users:      '/api/users',
      uploads:    '/api/uploads',
    }

    // DB conecction
    this.connectToDB();

    // Middlewares
    this.middlewares();

    // Rutas de aplicacion
    this.routes();

    // Sockets
    this.sockets();
  }

  async connectToDB () {
    await dbConnection()
  } 

  middlewares() {
    // CORS
    this.app.use(cors());
    // parse json
    this.app.use(express.json());
    // directorio público
    this.app.use(express.static('public'));
    // archivos temporales para manejo de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
    }));
  }

  routes () {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.categories, require('../routes/categories'));
    this.app.use(this.paths.products, require('../routes/products'));
    this.app.use(this.paths.search, require('../routes/search'));
    this.app.use(this.paths.users, require('../routes/users'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
  }

  sockets () {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen () {
    this.server.listen(this.port, () => {
      console.log(`App listening at localhost:${this.port}`);
    })
  }
}

module.exports = Server;

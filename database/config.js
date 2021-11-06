const mongoose = require('mongoose');

const dbConnection = async () => {

  try {

    // mongoose.connect('mongodb+srv://db_user_platzivideos:Qndpo1i07zTjW3DF@cluster0.cqns5.mongodb.net/blog_db', {useNewUrlParser: true});

    await mongoose.connect(process.env.MONGO_CNN);

    console.log('Base de datos ONLINE');
    
  } catch (error) {
    throw new Error('Error al acceder...');
    
  }
}

module.exports = {
  dbConnection
}
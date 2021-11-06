const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  role: {
    type: String,
    require: [true, 'A role is required']
  }
});

module.exports = model('Role', roleSchema);
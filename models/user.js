
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  }
});

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user} = this.toObject();
  return {  uid: _id, ...user };
}

const User = model('User', userSchema);

module.exports = User;

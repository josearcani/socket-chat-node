const { Schema, model } = require('mongoose');

const categorySchema = Schema({
  name: {
    type: String,
    require: [true, 'A name for the category is required'],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  }

})

categorySchema.methods.toJSON = function () {
  const { __v, state, _id, ...category} = this.toObject();
  return {  uid: _id, ...category };
}

module.exports = model('Category', categorySchema)
const { Schema, model } = require('mongoose');

const productSchema = Schema({
  name: {
    type: String,
    require: [true, 'A name for the product is required'],
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
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    require: true,
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  }
})

productSchema.methods.toJSON = function () {
  const { __v, state, _id, ...product} = this.toObject();
  return {  uid: _id, ...product };
}

module.exports = model('Product', productSchema)
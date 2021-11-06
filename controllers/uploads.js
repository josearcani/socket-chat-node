const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2;
const { response } = require("express");
const { uploadFileToServer } = require("../helpers");
const { Product, User } = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL);

/**
 *  Upload en local - pruebas
 */
const uploadFile = async (req, res = response) => {
  try {
    // images
    const filename = await uploadFileToServer(req.files, undefined, 'imgs');
    // text
    // const filename = await uploadFileToServer(req.files, ['txt', 'md'], 'text');
    res.json({
      filename
    })
  } catch (msg) {
    res.status(400).json({ msg })
  }
}

/**
 *  Upload imagen - users, products, local - pruebas
 */
const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The id ${id} does not exists in ${collection} collection`
        })
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The id ${id} does not exists in ${collection} collection`
        })
      }
      break;
    default:
      return res.status(500).json({ msg: 'not done yet'});
  }
  // limpiar imágenes del servidor
  if (model.img) {
    //verificar que la img existe en el servidor
    const pathname = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathname)) {
      fs.unlinkSync(pathname);
    }
  }
  // images
  const filename = await uploadFileToServer(req.files, undefined, collection);
  model.img = filename;
  // es como actualizar el documento con el nuevo dato
  await model.save();
  res.json(model);
}

/**
 * Upload to cloudinary
 */
const updateImageCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The id ${id} does not exists in ${collection} collection`
        })
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The id ${id} does not exists in ${collection} collection`
        })
      }
      break;
    default:
      return res.status(500).json({ msg: 'not done yet'});
  }
  // limpiar imágenes del servidor
  if (model.img) {
    //verificar que la img existe en cloudinary - public_id
    const nameArray = model.img.split('/');
    const publicName = nameArray[nameArray.length - 1];
    const [ public_id ] = publicName.split('.');
    cloudinary.uploader.destroy( public_id );
  }
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;
  await model.save(); // update the document
  res.json(model);
}


/**
 *  Endpoint para mostrar una imagen con url local y respaldo de imagen borrada - pruebas
 */
// mostrar imagen de user o product con un enlace
const showImage = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The id ${id} does not exists in ${collection} collection`
        })
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The id ${id} does not exists in ${collection} collection`
        })
      }
      break;
    default:
      return res.status(500).json({ msg: 'not done yet'});
  }
  if (model.img) {
    const pathname = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathname)) {
      return res.sendFile(pathname);
    }
  }
  const notFoundPath = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(notFoundPath);
}

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
}
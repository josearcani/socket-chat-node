const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFileToServer = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
  return new Promise((resolve, reject) => {

    const { file } = files;

    const nameCut = file.name.split('.');
    const extension = nameCut[ nameCut.length - 1 ];
  
    // validamos si es una extension permitida
    if (!validExtensions.includes(extension)) {
      return reject(`The extension ${extension} is not supported. Use ${validExtensions}`)
    }
  
    // cambiar nombre del archivo para el servidor
    const finalName = `${uuidv4()}.${extension}`
  
    const uploadPath = path.join(__dirname, '../uploads', folder, finalName);
  
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(finalName);
    });
  });

}

module.exports = {
  uploadFileToServer,
}

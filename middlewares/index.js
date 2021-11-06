const jwtValidator = require('./validate-jwt');
const fieldsValidator = require('./validate-fields');
const rolesValidator = require('./validate-roles');
const validateFile = require('./validate-file');

module.exports = {
  ...jwtValidator,
  ...fieldsValidator,
  ...rolesValidator,
  ...validateFile,
}
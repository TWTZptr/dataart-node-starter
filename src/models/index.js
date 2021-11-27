'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { DATABASE } = require('../config');
const Logger = require('../utils/logger');

const db = {};
const logger = new Logger('DatabaseConnectionError');

const sequelize = new Sequelize(
  DATABASE.dbname,
  DATABASE.username,
  DATABASE.password,
  DATABASE,
);

fs.readdirSync(__dirname)
  .filter((file) => file.includes('.') && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

try {
  sequelize.authenticate();
  sequelize.sync();
} catch (e) {
  logger.error(e);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.getFieldName = (errFields, modelName) => {
  if (!db[modelName]) {
    throw new Error(`Model "${modelName}" does not exist`);
  }
  const { fieldRawAttributesMap } = db[modelName];
  const field = Object.keys(errFields)[0].split('.').at(-1);
  if (!fieldRawAttributesMap[field]) {
    throw new Error(`Attribute "${field}" does not exists`);
  }
  return fieldRawAttributesMap[field].fieldName;
};

module.exports = db;

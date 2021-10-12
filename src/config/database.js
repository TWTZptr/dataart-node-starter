const env = process.env.NODE_ENV || 'development';
const db = require('./sequelize')[env];

module.exports = {
  host: db.host,
  port: db.port || 3306,
  dbname: db.database,
  user: db.username,
  password: db.password,
  charset: 'utf8mb4',
  connectionRetryCount: 5,
  maxConnections: 10,
  delayBeforeReconnect: 3000,
  showErrors: true,
  dialect: db.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

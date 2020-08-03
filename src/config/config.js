module.exports = {
  "development": {
    "username": "root",
    "password": "kunaguero10",
    "database": "pcus",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST_IP,
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST_IP,
    "dialect": "mysql",
    "logging": false
  }
}

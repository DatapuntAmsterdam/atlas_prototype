const dotenv = require('dotenv')

module.exports = dotenv.config({
  path: './.env.acceptance',
}).parsed

process.env.NODE_ENV = 'acceptance'

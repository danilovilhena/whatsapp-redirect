const express = require('express') 
const routes = require('./src/routes.js')

const app = express()
app.use(express.json())
app.use(routes)

module.exports = app
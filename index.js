const express = require('express') 
const cors = require('cors')
const userRoutes = require('./src/routes/user.js')
const linkRoutes = require('./src/routes/link.js')

const app = express()
app.use(cors())
app.use(express.json())
app.use(userRoutes)
app.use(linkRoutes)

module.exports = app
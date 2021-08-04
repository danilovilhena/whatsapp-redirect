const express = require('express') 
const routes = require('./routes.js')
const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(routes)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
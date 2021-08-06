const app = require('../index.js')
const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})
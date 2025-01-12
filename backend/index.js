const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('This is the backend')
})

//nodemon index.js
app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
})

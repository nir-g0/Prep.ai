const express = require('express') // Import express
const app = express() // Create an express app
const port = 3000 // Define the port number

let user = { length: 0, users: {} }
// Handle GET requests to "/"
app.get('/', (req, res) => {
  const { name } = req.query // Extract "name" from the query parameters
  if (name) {
    user['length'] += 1
    user['users'][name] = user['length']
  }
  res.json(user) // Respond with the name
})

// Start the server
app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
})

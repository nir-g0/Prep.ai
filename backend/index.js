const express = require('express') // Import express
const axios = require('axios') // Import axios
const fs = require('fs')
const multer = require('multer')
const app = express() // Create an express app
const port = 3000 // Define the port number

let user = { length: 0, users: {} }
let parsed_resume = {}
// Handle GET requests to "/"
app.get('/', (req, res) => {
  const { name } = req.query // Extract "name" from the query parameters
  if (name) {
    user['length'] += 1
    user['users'][name] = user['length']
  }
  res.json(user) // Respond with the name
})

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5242880 // 5 MB limit
  }
})

app.get('/parser_response', async (req, res) => {
  res.json(parsed_resume)
})

app.post('/parser', upload.single('pdf'), async (req, res) => {
  try {
    let pythonServerUrl = 'http://127.0.0.1:8080/'
    const fileStream = fs.createReadStream(req.file.path)
    const response = await axios.post(pythonServerUrl, fileStream, {
      headers: {
        'Content-Type': 'application/pdf'
      }
    })
    parsed_resume = response.data
    res.json(response.data)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  } finally {
    fs.rmSync('uploads', { recursive: true, force: true })
    fs.mkdirSync('uploads')
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
})

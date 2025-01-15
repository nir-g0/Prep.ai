const express = require('express') // Import express
const multer = require('multer')
const { default: parseResume } = require('./src/routes/parser')
const {
  AddUser: AddUser,
  AuthUser: AuthUser,
  DelUser: DelUser
} = require('./src/database/auth.js')

const app = express()
app.use(express.json())

let user = { length: 0, users: {} }

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
    fileSize: 5242880
  }
})

app.post('/add-user', async (req, res) => {
  try {
    const { email, password } = req.body
    const response = await AddUser(email, password)
    res.send(response)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.post('/auth-user', async (req, res) => {
  try {
    const { email, password } = req.body
    const response = await AuthUser(email, password)
    res.send(response)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.post('/del-user', async (req, res) => {
  try {
    const { email } = req.body
    const response = await DelUser(email)
    res.send(response)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.post('/parser', upload.single('pdf'), async (req, res) => {
  try {
    const response = await parseResume(req)
    res.json(response.data)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

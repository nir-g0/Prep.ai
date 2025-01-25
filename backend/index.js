const express = require('express') // Import express
const multer = require('multer')
const { parseResume: parseResume } = require('./src/routes/parser')
const {
  AddUser: AddUser,
  AuthUser: AuthUser,
  DelUser: DelUser,
  AttachResume: AttachResume,
  CreateSession: CreateSession,
  GetSessions,
  GetSession,
  DeleteSession,
  UpdateSession
} = require('./src/database/auth.js')

const {
  generateQuestions: generateQuestions,
  generateFeedback: generateFeedback
} = require('./src/routes/llm.js')

const cors = require('cors')
const fs = require('fs')
const app = express()
app.use(
  cors({
    origin: 'http://localhost:3001', // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // If you're using cookies
  })
)
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

app.post('/resume-parse', upload.single('pdf'), async (req, res) => {
  try {
    const response = await parseResume(req)
    const fileName = req.file.filename
    const headers = req.headers

    const saved_resume = await AttachResume(headers.authorization, fileName)
    if (saved_resume[1] != null) {
      fs.unlink(`./uploads/${saved_resume[1]}`, err => {
        if (err) {
          console.error('Error deleting file:', err)
        } else {
          console.log('File deleted successfully')
        }
      })
    }

    res.json({ data: response.data })
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.post('/listing-parse', upload.single('pdf'), async (req, res) => {
  try {
    const response = await parseResume(req)

    const fileName = req.file.filename
    fs.unlink(`./uploads/${fileName}`, err => {
      if (err) {
        console.error('Error deleting file:', err)
      } else {
        console.log('File deleted successfully')
      }
    })

    res.json({ data: response.data })
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.post('/create-session', async (req, res) => {
  try {
    const { cookie, data } = req.body
    const response = await CreateSession(cookie, data)
    res.send(response.data)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.get('/get-sessions', async (req, res) => {
  try {
    const cookie = req.headers.authorization
    const response = await GetSessions(cookie)
    res.json(response)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.post('/delete-session', async (req, res) => {
  try {
    const { id, title } = req.body
    const response = await DeleteSession(id, title)
    res.send(response)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
})

app.get('/get-session', async (req, res) => {
  try {
    const { id, authToken } = req.query
    const response = await GetSession(id, authToken)
    res.send(response)
  } catch (error) {
    console.error('Error: ', error)
  }
})

app.post('/gen-qs', async (req, res) => {
  try {
    const { sessionId, query_data, column } = req.body
    const response = await generateQuestions(query_data)
    await UpdateSession(sessionId, column, response)
    console.log(response)
    res.send(response)
  } catch (error) {
    console.error('Error: ', error)
  }
})

app.post('/gen-feedback', async (req, res) => {
  try {
    const { transcript, question } = req.body
    const response = await generateFeedback(transcript, question)
    res.send(response)
  } catch (error) {
    console.error('Error: ', error)
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

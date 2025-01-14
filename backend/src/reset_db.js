const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '/Volumes/Virus/Prep.ai/.env' })

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'prepai'
})

client
  .connect()
  .then(async () => {
    console.log('Connected to the database')
    const schemaPath = path.join(__dirname, 'reset_schema.sql')
    const resetDBQuery = fs.readFileSync(schemaPath, 'utf8')
    await client.query(resetDBQuery)
    return client.end()
  })
  .then(() => {
    console.log('Disconnected from the PostgreSQL database.')
  })
  .catch(err => {
    console.error('Error connecting or disconnecting:', err.stack)
  })

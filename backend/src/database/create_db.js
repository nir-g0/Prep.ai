const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const client = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'prepai',
  ssl: {
    rejectUnauthorized: false // Disable strict certificate checking for testing
  }
})

client
  .connect()
  .then(async () => {
    console.log('Connected to the database')
    const schemaPath = path.join(__dirname, 'schema.sql')
    const createDbQuery = fs.readFileSync(schemaPath, 'utf8')
    console.log('Successfully created DB Schema')
    await client.query(createDbQuery)
  })
  .catch(err => {
    console.error('Error connecting or disconnecting:', err.stack)
  })
  .finally(async () => {
    console.log('Disconnected from the PostgreSQL database.')
    return await client.end()
  })

const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const argon2 = require('argon2')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'prepai'
})

const CreateHash = async password => {
  try {
    return await argon2.hash(password)
  } catch (err) {
    console.error('Error hashing password:', err)
    throw err
  }
}

const AddUser = async (email, password) => {
  const client = await pool.connect()
  try {
    const query = 'INSERT INTO users (email, hashed_password) VALUES ($1, $2)'
    const hashed_password = await CreateHash(password)
    const values = [email, hashed_password]
    await client.query(query, values)
    return true
  } catch (err) {
    console.error('Error adding user:', err)
    return false
  } finally {
    client.release()
  }
}

const DelUser = async email => {
  const client = await pool.connect()
  try {
    await client.query('DELETE FROM users WHERE email = $1', [email])
    return true
  } catch (err) {
    console.error('Error deleting user:', err)
    return false
  } finally {
    client.release()
  }
}

const AuthenticateUser = async (email, password) => {
  const client = await pool.connect()
  try {
    const res = await client.query(
      'SELECT hashed_password FROM users WHERE email = $1',
      [email]
    )

    if (res.rows.length === 0) {
      return false
    }

    const hashed_password = res.rows[0].hashed_password
    const isValid = await argon2.verify(hashed_password, password)
    return isValid
  } catch (err) {
    console.error('Error authenticating user:', err)
    return false
  } finally {
    client.release()
  }
}

module.exports.DelUser = DelUser
module.exports.AuthUser = AuthenticateUser
module.exports.AddUser = AddUser

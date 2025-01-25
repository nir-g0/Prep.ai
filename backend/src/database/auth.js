const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const argon2 = require('argon2')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'prepai',
  ssl: {
    rejectUnauthorized: false // Disable strict certificate checking for testing
  }
})

const CreateHash = async password => {
  try {
    return await argon2.hash(password)
  } catch (err) {
    console.error('Error hashing password:', err)
    throw err
  }
}

const GetUserByToken = async token => {
  const client = await pool.connect()
  try {
    const response = await client.query(
      'SELECT id AS user_id FROM users WHERE auth_token = $1;',
      [token]
    )
    return parseInt(response.rows[0].user_id)
  } catch (err) {
  } finally {
    client.release()
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
const InsertToken = async (client, token, email) => {
  try {
    const query = 'UPDATE users SET auth_token = $1 WHERE email = $2'
    const values = [token, email]
    await client.query(query, values)
  } catch (err) {
    console.error('Error saving token:', err)
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
    if (isValid) {
      const token = Math.random().toString(36).substring(2)
      InsertToken(client, token, email)
      return [true, token]
    }
  } catch (err) {
    console.error('Error authenticating user:', err)
    return false
  } finally {
    client.release()
  }
}

const AttachResume = async (cookies, hash) => {
  const client = await pool.connect()
  try {
    const init = await client.query(
      'SELECT id FROM users WHERE auth_token = $1',
      [cookies]
    )
    const user = init.rows[0]['id']
    let toDelete = await client.query(
      'SELECT dir_hash FROM resumes WHERE user_id = $1',
      [user]
    )
    toDelete = toDelete.rows[0].dir_hash

    await client.query(
      'INSERT INTO resumes (user_id, dir_hash) VALUES ' +
        '($1, $2) ON CONFLICT (user_id) DO UPDATE SET dir_hash = $2',
      [user, hash]
    )
    if (!toDelete) {
      return [true, null]
    }

    return [true, toDelete]
  } catch (err) {
    console.log(err)
    return false
  } finally {
    client.release()
  }
}

const CreateSession = async (token, data) => {
  const client = await pool.connect()
  try {
    const response = await client.query(
      'SELECT user_id, id AS resume_id FROM resumes WHERE user_id IN ' +
        '(SELECT user_id FROM users WHERE auth_token = $1 );',
      [token]
    )
    const user_id = response.rows[0].user_id
    const resume_id = response.rows[0].resume_id
    const pos_type = data.title + ' | ' + data.company
    await client.query(
      'INSERT INTO sessions (user_id, resume_id, position_type, session_data)' +
        ' VALUES ($1, $2, $3, $4);',
      [user_id, resume_id, pos_type, data]
    )
    return true
  } catch (err) {
    console.log(err)
    return false
  } finally {
    client.release()
  }
}

const GetSessions = async token => {
  const client = await pool.connect()
  try {
    const user_id = await GetUserByToken(token)
    const response2 = await client.query(
      'SELECT id, position_type, session_date FROM sessions WHERE user_id = $1',
      [user_id]
    )
    return response2.rows
  } catch (err) {
    console.log(err)
    return false
  } finally {
    client.release()
  }
}

const DeleteSession = async (id, title) => {
  const client = await pool.connect()
  try {
    await client.query(
      'DELETE FROM sessions WHERE id = $1 AND position_type = $2;',
      [id, title]
    )
    return true
  } catch (err) {
    console.log(err)
    return false
  } finally {
    client.release()
  }
}

const GetSession = async (id, token) => {
  const client = await pool.connect()
  try {
    const user_id = await GetUserByToken(token)
    const response2 = await client.query(
      'SELECT id, position_type, session_data, questions FROM sessions WHERE user_id = $1 AND id = $2;',
      [user_id, id]
    )
    return response2.rows[0]
  } catch (err) {
    console.log(err)
    return false
  } finally {
    client.release()
  }
}

const UpdateSession = async (id, column, data) => {
  const client = await pool.connect()
  try {
    console.log(data)
    const query = `UPDATE sessions SET ${column} = $1 WHERE id = $2`
    const values = [{ questions: data }, id]
    await client.query(query, values)
    return true
  } catch (err) {
    console.error('Error updating session:', err)
    return false
  } finally {
    client.release()
  }
}

module.exports.DelUser = DelUser
module.exports.AuthUser = AuthenticateUser
module.exports.AddUser = AddUser
module.exports.AttachResume = AttachResume
module.exports.CreateSession = CreateSession
module.exports.GetSessions = GetSessions
module.exports.DeleteSession = DeleteSession
module.exports.GetSession = GetSession
module.exports.UpdateSession = UpdateSession

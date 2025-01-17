import React, { useState } from 'react'

import '../../global.css' // Import your global CSS
import axios from 'axios'

function LoginPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      console.log('Attempting Login')
      const response = await axios.post('http://localhost:3000/auth-user', {
        email: email,
        password: password
      })
      if (response.data) {
        window.location.href = '/home'
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('An error occurred during signup. Please try again later.')
    }
  }

  return (
    <div className='container'>
      <div className='card'>
        <h1 className='h1'>Prep.ai</h1>
        <h2 className='h2'>Login</h2>
        <form
          className='form'
          onSubmit={e => {
            e.preventDefault() // Prevent default form submission
            handleLogin() // Call handleSignUp if ready
          }}
        >
          <input
            type='email'
            placeholder='Email'
            className='input'
            required
            onChange={e => setEmail(e.target.value)}
          />
          <input
            onChange={e => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
            className='input'
            required
          />
          <button type='submit' className='btn-primary'>
            Log In
          </button>
        </form>
        <p>
          Don't have an account? <a href='/signup'>Sign Up Here</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

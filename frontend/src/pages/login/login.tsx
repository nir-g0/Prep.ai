import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import '../../global.css'
import axios from 'axios'
import Divider from '../../components/divider.tsx'

function LoginPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const setLoginCookie = (token: string) => {
    Cookies.set('authToken', token, { expires: 2 / 24 })
    console.log(token)
  }

  useEffect(() => {
    const authToken = Cookies.get('authToken')
    if (authToken) {
      window.location.href = '/home'
    }
  }, [])

  const handleLogin = async () => {
    try {
      console.log('Attempting Login')
      const response = await axios.post('http://localhost:3000/auth-user', {
        email: email,
        password: password
      })
      if (response.data[0]) {
        setLoginCookie(response.data[1])
        window.location.href = '/home'
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('An error occurred during signup. Please try again later.')
    }
  }

  return (
    <div>
      <Divider />
      <Divider />
      <Divider />
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

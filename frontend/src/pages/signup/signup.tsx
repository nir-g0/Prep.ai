import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Divider from '../../components/divider.tsx'
import '../../global.css'
function SignupPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [ready, setReady] = useState(false)

  const passReq =
    "Must include: at least 7 characters, at least one of: '!', '@', '#','$', '%', '^', '&', '?', at least one uppercase character, at least one lowercase character and at least one number"

  const handleSignUp = async () => {
    try {
      console.log('Attempting signup')
      const response = await axios.post('http://localhost:3000/add-user', {
        email: email,
        password: password
      })

      if (response.data) {
        alert('Account created')
        window.location.href = '/login'
      } else {
        alert('User not added. User already exists.')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('An error occurred during signup. Please try again later.')
    }
  }

  useEffect(() => {
    const chars = ['!', '@', '#', '$', '%', '^', '&', '?']

    const validPassword = () => {
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSpecialChar = chars.some(char => password.includes(char))

      return (
        password.length > 7 &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
      )
    }

    if (validPassword() && password === confirm) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [password, confirm])

  return (
    <div className='container'>
      <div className='card sm'>
        <h1>Prep.ai</h1>
        <h2>Create an Account</h2>
        <form
          className='form container'
          onSubmit={e => {
            e.preventDefault() // Prevent default form submission
            if (ready) {
              handleSignUp() // Call handleSignUp if ready
            }
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
          <p>{passReq}</p>
          <input
            onChange={e => setConfirm(e.target.value)}
            type='password'
            placeholder='Confirm Password'
            className='input'
            required
          />
          <button
            disabled={!ready}
            type='submit'
            className={ready ? 'btn-primary' : 'btn-primary-disabled'}
          >
            Sign Up
          </button>
        </form>
        <Divider />
        <div>
          <p className='p'>
            Already have an account?
            <a href='/login'> Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/home/home.tsx'
import React from 'react'
import LoginPage from './pages/login/login.tsx'
import SignupPage from './pages/signup/signup.tsx'
function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route
            path='/'
            element={
              <li>
                <Link to='home'>Home</Link>
                <Link to='login'>Login</Link>
              </li>
            }
          />
          <Route path='home' element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

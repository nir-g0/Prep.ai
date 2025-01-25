import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/home/home.tsx'
import React from 'react'
import LoginPage from './pages/login/login.tsx'
import SignupPage from './pages/signup/signup.tsx'
import LandingScreen from './pages/landing/landing.tsx'
import SurveyPage from './pages/survey/survey.tsx'
import SessionPage from './pages/session/session.tsx'
function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path='/' element={<LandingScreen />} />
          <Route path='home' element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignupPage />} />
          <Route path='create-int' element={<SurveyPage />} />
          <Route path='/session/:id' element={<SessionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

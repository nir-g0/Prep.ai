import React from 'react'
import '../../global.css' // Import your global CSS
import Divider from '../../components/divider.tsx'
function LandingPage () {
  return (
    <>
      <nav className='navbar'>
        <div className='navbar-logo'>Prep.ai [ALPHA]</div>
        <div className='navbar-links'>
          <a href='/signup' className='nav-link'>
            Sign Up
          </a>
          <a href='/login' className='nav-link'>
            Log In
          </a>
        </div>
      </nav>
      <div className='container vertical'>
        <Divider />
        <Divider />

        <div id='features' className='card wide'>
          <h1 className='hero-title'>Prep.ai [ALPHA]</h1>
          <Divider />
          <div className='feature-list'>
            <p className='hero-subtitle'>
              Tailored feedback, progress tracking and dynamic mock interviews.
            </p>
            <div className='feature-item'>
              <h3>Mock Interviews</h3>
              <p>
                Choose role, difficulty, and practice with real-time feedback.
              </p>
            </div>
            <div className='feature-item'>
              <h3>Realtime Feedback</h3>
              <p>Personalized insights for text and verbal responses.</p>
            </div>
            <div className='feature-item'>
              <h3>Progress Dashboard</h3>
              <p>Track your progress with detailed analytics.</p>
            </div>
          </div>
          <Divider />

          <div>
            <button
              className='btn-primary'
              onClick={() => (window.location.href = '/signup')}
            >
              Get Started
            </button>
            <p className='secondary-text'>
              Already have an account?{' '}
              <a href='/login' className='link'>
                Log In
              </a>
            </p>
          </div>
        </div>
        <footer className='footer'>
          <p>© 2025 Prep.ai. All rights reserved.</p>
          <div className='footer-links'>
            <a href='/privacy'>Privacy Policy</a>
            <a href='/terms'>Terms of Service</a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage

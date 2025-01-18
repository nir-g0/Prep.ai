import React from 'react'
import '../../global.css' // Import your global CSS

function LandingPage () {
  return (
    <div className='container'>
      {/* Top Bar */}
      <nav className='navbar'>
        <div className='navbar-logo'>Prep.ai</div>
        <div className='navbar-links'>
          <a href='/signup' className='nav-link'>
            Sign Up
          </a>
          <a href='/login' className='nav-link'>
            Log In
          </a>
        </div>
      </nav>

      <div id='features' className='features'>
        <h1 className='hero-title'>Prep.ai</h1>
        <p className='hero-subtitle'>
          Tailored feedback, progress tracking, and dynamic mock interviews
          designed for your success.
        </p>
        <div className='feature-list'>
          <div className='feature-item'>
            <h3>Mock Interviews</h3>
            <p>
              Choose role, difficulty, and practice with real-time feedback.
            </p>
          </div>
          <div className='feature-item'>
            <h3>AI Feedback</h3>
            <p>Personalized insights for text and verbal responses.</p>
          </div>
          <div className='feature-item'>
            <h3>Progress Dashboard</h3>
            <p>Track your progress with detailed analytics.</p>
          </div>
        </div>
        <div className='cta-buttons'>
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
        <footer className='footer'>
          <p>© 2025 Prep.ai. All rights reserved.</p>
          <div className='footer-links'>
            <a href='/privacy'>Privacy Policy</a>
            <a href='/terms'>Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage

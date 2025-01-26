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
      <div className='container'>
        <div id='features' className='card'>
          <h1 className='hero-title'>Prep.ai [ALPHA]</h1>
          <Divider />
          <p className='card-title center-text'>
            Revolutionize interview prep with AI-driven questions, personalized
            feedback, and dynamic progress tracking.
          </p>
          <Divider />

          <button
            className='btn-primary'
            onClick={() => (window.location.href = '/signup')}
          >
            Get Started
          </button>
          <Divider />
          <div>
            <p className='secondary-text'>
              Already have an account?{' '}
              <a href='/login' className='link'>
                Log In
              </a>
            </p>
          </div>
        </div>
        <footer className='card'>
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

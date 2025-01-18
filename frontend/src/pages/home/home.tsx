import React from 'react'
import '../../global.css' // Import your global CSS

const HomePage = () => {
  const userName = 'John Doe' // Replace with dynamic user data from your backend/session.

  return (
    <div className='container'>
      <nav className='navbar'>
        <div className='navbar-logo'>Prep.ai</div>
        <div className='navbar-links'>
          <a href='/profile' className='nav-link'>
            Profile
          </a>
          <a href='/' className='nav-link'>
            Log Out
          </a>
        </div>
      </nav>

      <div>
        <div className='hero'>
          <h1 className='hero-title'>Welcome back, {userName}!</h1>
          <p className='hero-subtitle'>
            Ready to level up your skills? Start a new mock interview or review
            your progress below.
          </p>
          <div className='hero-cta'>
            <a href='/mock-interview' className='btn-primary'>
              Start a Mock Interview
            </a>
            <a href='/dashboard' className='btn-secondary'>
              View Dashboard
            </a>
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
      <div className='container'>
        <h2 className='section-title'>Your Recent Activity</h2>
      </div>

      {/* Dashboard Preview */}

      {/* Footer */}
    </div>
  )
}

export default HomePage

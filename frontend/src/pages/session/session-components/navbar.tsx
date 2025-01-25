import React from 'react'
import '../../../global.css'
import './navbar.css'

const SessionNavbar = ({ jobTitle = 'Job Title | Company Name', id = -1 }) => {
  return (
    <div className='navbar'>
      <div className='navbar-logo'>Prep.ai [ALPHA]</div>
      <div className='job-info'>{jobTitle}</div>
      <button
        onClick={() => {
          window.location.href = '/home'
        }}
        className='btn-secondary'
      >
        Save and Exit
      </button>
    </div>
  )
}
export default SessionNavbar

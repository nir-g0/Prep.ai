import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import '../../global.css' // Import your global CSS
import './home.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoadingComponent from '../../components/loading.tsx'

/**
 * HomePage component that displays the user's sessions and provides options to create a new session,
 * view profile, and log out. It checks for authorization using a cookie and fetches session data from the server.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <HomePage />
 *
 * @remarks
 * - Redirects to the home page if the user is not authorized.
 * - Displays a loading component while fetching session data.
 * - Provides options to start or delete a session.
 *
 * @function
 * @name HomePage
 *
 * @hook
 * @name useState
 * @description Manages the state for authorization, sessions, and loading status.
 *
 * @hook
 * @name useEffect
 * @description Fetches session data from the server when the component mounts.
 *
 * @hook
 * @name useNavigate
 * @description Provides navigation functionality.
 *
 * @param {boolean} authorized - Indicates if the user is authorized.
 * @param {Function} setAuthorized - Updates the authorization state.
 * @param {Array} sessions - List of user sessions.
 * @param {Function} setSessions - Updates the sessions state.
 * @param {boolean} loading - Indicates if the session data is being loaded.
 * @param {Function} setLoading - Updates the loading state.
 * @param {Function} navigate - Function to navigate to different routes.
 *
 * @function
 * @name handleLogOut
 * @description Logs out the user by removing the authorization cookie and redirecting to the home page.
 *
 * @function
 * @name handleDelete
 * @description Deletes a session by sending a request to the server and updating the sessions state.
 * @param {string} id - The ID of the session to delete.
 * @param {string} title - The title of the session to delete.
 */
const HomePage = () => {
  const [authorized, setAuthorized] = useState(false)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = Cookies.get('authToken')
    if (authToken) {
      console.log('Cookie exists:', authToken)
      setAuthorized(true)
    } else {
      window.location.href = '/'
      return
    }
    setLoading(true)
    const getSessions = async () => {
      try {
        const data = await axios.get('http://localhost:3000/get-sessions', {
          headers: {
            Authorization: `${authToken}`
          }
        })
        const dl = data.data
        setSessions(
          dl.map(d => ({
            id: d.id,
            title: d.position_type,
            date: d.session_date
          }))
        )
        setLoading(false)
      } catch (err) {
        alert(err)
      }
    }
    getSessions()
  }, [])

  const handleLogOut = () => {
    Cookies.remove('authToken')
    setAuthorized(false)
    window.location.href = '/'
  }

  const handleDelete = async (id, title) => {
    await axios.post('http://localhost:3000/delete-session', {
      id: id,
      title: title
    })
    const index = sessions.findIndex(session => session.id === id)
    if (index !== -1) {
      const updatedSessions = [...sessions]
      updatedSessions.splice(index, 1)
      setSessions([...updatedSessions])
    }
  }

  if (loading) {
    return (
      <div className='container'>
        <LoadingComponent />
      </div>
    )
  }

  return authorized ? (
    <>
      <nav className='navbar'>
        <div className='navbar-logo'>Prep.ai</div>
        <div className='navbar-links'>
          <a href='/profile' className='nav-link'>
            Profile
          </a>
          <a href='/' className='nav-link' onClick={handleLogOut}>
            Log Out
          </a>
        </div>
      </nav>

      <div className='layout'>
        <div className='vertical-column'>
          <button
            onClick={() => {
              window.location.href = '/create-int'
            }}
            className='btn-primary'
          >
            Create a Mock Interview
          </button>
        </div>

        <div className='main-content'>
          <h1 className='hero-title'>Your Sessions</h1>
          <div className='container card main-content-card'>
            {sessions.length > 0 ? (
              sessions.map(session => (
                <div key={session.id} className='card-item'>
                  <h2 className='card-title'>{session.title}</h2>
                  <p className='card-date'>
                    {new Date(session.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className='card-actions'>
                    <button
                      onClick={() => {
                        navigate(`/session/${session.id}`)
                      }}
                      className='btn-start'
                    >
                      Start
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(session.id, session.title)
                      }}
                      className='btn-delete'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent activity</p>
            )}
          </div>
        </div>
      </div>
      <footer className='footer'>
        <p>© 2025 Prep.ai. All rights reserved.</p>
        <div className='footer-links'>
          <a href='/privacy'>Privacy Policy</a>
          <a href='/terms'>Terms of Service</a>
        </div>
      </footer>
    </>
  ) : (
    <></>
  )
}

export default HomePage

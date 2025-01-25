import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import '../../global.css' // Import your global CSS
import './home.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoadingComponent from '../../components/loading.tsx'
import Divider from '../../components/divider.tsx'
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
  return authorized ? (
    <>
      <nav className='navbar'>
        <div className='navbar-logo'>Prep.ai [ALPHA]</div>
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
            Start a Mock Interview
          </button>
        </div>

        <div className='main-content'>
          <h1 className='hero-subtitle'>Your Sessions</h1>
          {loading ? (
            <LoadingComponent />
          ) : (
            <div className='card bg bg2'>
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
          )}
          <Divider />
          <Divider />
          <Divider />
          <Divider />
          <footer className='footer'>
            <p>© 2025 Prep.ai. All rights reserved.</p>
            <div className='footer-links'>
              <a href='/privacy'>Privacy Policy</a>
              <a href='/terms'>Terms of Service</a>
            </div>
          </footer>
        </div>
      </div>
    </>
  ) : (
    <></>
  )
}

export default HomePage

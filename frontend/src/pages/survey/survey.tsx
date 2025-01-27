import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import jsPDF from 'jspdf'
import './survey.css'
import '../../global.css'
import LoadingComponent from '../../components/loading.tsx'
const SurveyPage = () => {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [application, setApplication] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeButton, setActiveButton] = useState<'technical' | 'general'>(
    'technical'
  )

  useEffect(() => {
    const authToken = Cookies.get('authToken')
    if (!authToken) {
      window.location.href = '/'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    if (resume) {
      const formData = new FormData()
      formData.append('pdf', resume)

      try {
        const authToken = Cookies.get('authToken')
        const response = await axios.post(
          'http://localhost:3000/resume-parse',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `${authToken}`
            }
          }
        )
        const parsed_resume = response.data
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        const doc = new jsPDF()
        doc.text(application, 10, 10) // Add the application text at position (10, 10)
        const pdfBlob = doc.output('blob') // Output as a Blob

        // Create FormData and append the generated PDF
        const applicationFormData = new FormData()
        applicationFormData.append(
          'pdf',
          new File([pdfBlob], 'application.pdf', { type: 'application/pdf' })
        ) // Treat the blob as a File

        const applicationResponse = await axios.post(
          'http://localhost:3000/listing-parse',
          applicationFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        const out = {
          title,
          company,
          position_requirements: applicationResponse.data,
          users_skills: parsed_resume,
          interview_type: activeButton
        }
        const final = await axios.post('http://localhost:3000/create-session', {
          cookie: authToken,
          data: out
        })
        if (!final) {
          alert('Something went wrong, please try again')
          setLoading(false)
        } else {
          window.location.href = '/home'
          setLoading(false)
        }
      } catch (error) {
        console.error('Error parsing resume:', error)
      }
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0])
    }
  }

  const handleButtonToggle = (button: 'technical' | 'general') => {
    setActiveButton(button)
  }

  return loading ? (
    <LoadingComponent />
  ) : (
    <div className='container'>
      <div className='container vertical'>
        <form onSubmit={handleSubmit} className='card'>
          <h1>Create Interview</h1>
          <div className='form-group'>
            <label htmlFor='title'>Position Title</label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='company'>Company</label>
            <input
              type='text'
              id='company'
              value={company}
              onChange={e => setCompany(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='application'>
              Position Requirements (paste here)
            </label>
            <textarea
              id='application'
              value={application}
              onChange={e => setApplication(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='questions-type'>Questions-type</label>
            <div className='toggle-buttons align-middle'>
              <button
                className={`btn ${
                  activeButton === 'technical'
                    ? 'btn-primary'
                    : 'btn-primary disabled'
                }`}
                onClick={() => handleButtonToggle('technical')}
              >
                Technical
              </button>
              <button
                className={`btn ${
                  activeButton === 'general'
                    ? 'btn-primary'
                    : 'btn-primary disabled'
                }`}
                onClick={() => handleButtonToggle('general')}
              >
                General
              </button>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='resume'>Resume (PDF)</label>
            <input
              type='file'
              id='resume'
              accept='application/pdf'
              onChange={handleFileChange}
              required
            />
          </div>

          <button type='submit' className='btn-primary'>
            Submit
          </button>
          <button
            onClick={() => {
              window.location.href = '/home'
            }}
            type='cancel'
            className='btn-secondary'
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default SurveyPage

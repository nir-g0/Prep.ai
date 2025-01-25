import React, { useState, useEffect } from 'react'
import './session.css' // Assuming you have a CSS file for styles
import '../../global.css'
import Cookies from 'js-cookie'
import SessionNavbar from './session-components/navbar.tsx'
import LoadingComponent from '../../components/loading.tsx'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

import axios from 'axios'

const SessionPage = () => {
  const [questionCount, setQuestionCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false)
  const [isFinalScoreVisible, setIsFinalScoreVisible] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  const [questionsList, setQuestionsList] = useState([])
  const totalQuestions = 7
  const [text, setText] = useState('')
  const [listeningTimer, setListeningTimer] = useState(null) // Timer state

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  useEffect(() => {
    setText(transcript)
  }, [transcript])

  // Fetch session data from backend
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const link = window.location.href.split('/')
        const sessionID = link[link.length - 1]
        const response = await axios.get('http://localhost:3000/get-session', {
          params: { id: sessionID, authToken: Cookies.get('authToken') }
        })
        setSessionData(response.data)
      } catch (error) {
        console.error('Error fetching session data:', error)
      }
    }

    const authToken = Cookies.get('authToken')
    if (!authToken) {
      window.location.href = '/'
      return
    }

    setAuthorized(true)
    setLoading(true)
    fetchSessionData()
  }, [])

  // Fetch questions after session data is set
  useEffect(() => {
    if (!sessionData) return

    if (!sessionData['questions']) {
      console.log('Fetching questions...')
      const fetchQuestions = async () => {
        const session_data = sessionData['session_data']
        const query_data = {
          company: session_data['company'],
          position_skills:
            session_data['position_requirements']['data']['skills'],
          position: session_data['title'],
          applicant_skills: [
            ...session_data['users_skills']['data']['projects'],
            ...session_data['users_skills']['data']['skills']
          ]
        }

        const link = window.location.href.split('/')
        const sessionID = link[link.length - 1]

        try {
          const response = await axios.post('http://localhost:3000/gen-qs', {
            sessionId: sessionID,
            query_data,
            column: 'questions'
          })
          setQuestionsList(response.data)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching questions:', error)
        }
      }

      fetchQuestions()
    } else {
      console.log('Pulling saved questions')
      setQuestionsList([...sessionData['questions']['questions']])
      setLoading(false)
    }
  }, [sessionData])

  // Start listening and set the 2-minute timer
  const beginListening = () => {
    SpeechRecognition.startListening({ continuous: true })
    const timer = setTimeout(() => {
      SpeechRecognition.stopListening()
      console.log('Stopped listening after 2 minutes')
    }, 120000) // 2 minutes in milliseconds
    setListeningTimer(timer) // Save timer reference
  }

  // Stop listening manually and clear the timer
  const handleGenerateFeedback = async () => {
    SpeechRecognition.stopListening()
    if (listeningTimer) clearTimeout(listeningTimer) // Clear the timer
    const response = await axios.post('http://localhost:3000/gen-feedback', {
      transcript: text,
      question: questionsList[questionCount]
    })
    console.log(response.data)
    setFeedback(response.data)
    setIsFeedbackVisible(true)
  }

  const handleNextQuestion = () => {
    if (questionCount < totalQuestions) {
      setQuestionCount(questionCount + 1)
      setFeedback('')
      setIsFeedbackVisible(false)
    } else {
      setIsFinalScoreVisible(true)
    }
    SpeechRecognition.stopListening()
    resetTranscript()
    setText(transcript)
  }

  return authorized ? (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {sessionData && (
            <SessionNavbar jobTitle={sessionData['position_type']} />
          )}
          <div className='container'>
            {!isFinalScoreVisible ? (
              <div className='session-content'>
                <div className='card'>
                  <div className='title'>
                    Question {questionCount + 1}: {questionsList[questionCount]}
                  </div>
                  {isFeedbackVisible ? (
                    <>
                      <div className='container vertical'>
                        <div className='sub-title'>Transcription:</div>
                        <p>{text}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {listening ? (
                        <button
                          className='microphone-button-red'
                          onClick={handleGenerateFeedback}
                        >
                          🎤
                        </button>
                      ) : (
                        <button
                          className='microphone-button'
                          onClick={beginListening}
                        >
                          🎤
                        </button>
                      )}
                      <div className='container vertical'>
                        <div className='sub-title'>Transcription:</div>
                        <p>{text}</p>
                      </div>
                    </>
                  )}
                </div>

                {isFeedbackVisible && (
                  <div className='feedback'>
                    <strong>Feedback:</strong>
                    <p>{feedback}</p>
                  </div>
                )}
                <div className='container-small'>
                  <button
                    className='btn-primary'
                    onClick={() => {
                      SpeechRecognition.stopListening()
                      resetTranscript()
                      setText(transcript)
                      setQuestionCount(questionCount + 1)
                    }}
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className='container'>
                <div className='session-content'>
                  <div className='card final-score'>Your final score: 85%</div>
                </div>
              </div>
            )}
          </div>

          {!isFinalScoreVisible && isFeedbackVisible && (
            <div className='next-arrow' onClick={handleNextQuestion}>
              ➡️
            </div>
          )}
        </>
      )}
    </div>
  ) : (
    <></>
  )
}

export default SessionPage

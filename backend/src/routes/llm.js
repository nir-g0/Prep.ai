const OpenAI = require('openai')
const path = require('path')
const dotenv = require('dotenv')
const _filename = __filename
const _dirname = __dirname
dotenv.config({
  path: path.resolve(_dirname, '.env')
})

const openai = new OpenAI({
  apiKey: process.env.LLM,
  project: 'proj_MQlPOXML5uXAvK6ykhO4tJNq'
})

/**
 * Generates a JSON object containing exactly 7 unique interview questions.
 * @param {string} role - The job role the candidate is applying for.
 * @param {string} company - The company the candidate is applying to.
 * @param {Array<string>} positionSkills - Skills required for the position.
 * @param {Array<string>} applicantSkills - Skills possessed by the applicant.
 * @returns {Promise<object>} JSON object with 7 unique questions.
 */
const generateQuestions = async query_data => {
  console.log('query received')
  try {
    const prompt =
      `You are a job interviewer. The candidate is applying for a ${query_data['position']} role at ${query_data['company']}. ` +
      `The position requires the following skills: ${query_data['position_skills']}. ` +
      `The candidate has the following skills: ${query_data['application_skills']}. ` +
      `Please generate exactly 7 unique interview questions tailored to this candidate. ` +
      `Make sure the questions are specific, relevant, and appropriate for the role's level.` +
      `Return the questions as an array of strings. Do not include any additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ]
    })

    const responseContent = completion.choices[0].message.content
    const cleanContent = responseContent
      .replace(/```json/g, '') // Remove ```json
      .replace(/```/g, '') // Remove closing ```
      .trim()
    // Parse questions from the response content
    const questions = JSON.parse(cleanContent)
    return questions
  } catch (error) {
    console.error('Error generating questions:', error)
    throw error
  } finally {
    console.log('Generated')
  }
}

const generateFeedback = async (response, question) => {
  console.log(question)
  try {
    const prompt =
      `You are a job interviewer. The candidate is responding to a questino you gave him. ` +
      `The question you asked was ${question}.` +
      `You are a nice interviewer, so you are going to provide honest but harsh feedback to the candidate based on their response` +
      `talk about what they could add, what they can remove, what filler words they used, etc. Respond in a paragraph,
      make youre response clear and easy to understand`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: response
        }
      ]
    })

    const responseContent = completion.choices[0].message.content
    return responseContent
  } catch (error) {
    console.error('Error generating feedback:', error)
    throw error
  } finally {
    console.log('Generated')
  }
}

module.exports.generateQuestions = generateQuestions
module.exports.generateFeedback = generateFeedback

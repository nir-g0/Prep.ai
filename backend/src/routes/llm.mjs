import OpenAI from 'openai'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({
  path: path.resolve(__dirname, '.env')
})

const openai = new OpenAI({
  apiKey: process.env.LLM,
  project: 'proj_MQlPOXML5uXAvK6ykhO4tJNq'
})

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are a job interviewer' },
    {
      role: 'user',
      content: 'Write one simple interview question about birds'
    }
  ]
})

console.log(completion.choices[0].message.content)

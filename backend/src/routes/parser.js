const fs = require('fs')
const axios = require('axios') // Import axios

async function parseResume (req) {
  let pythonServerUrl = 'http://127.0.0.1:8080/'
  const fileStream = fs.createReadStream(req.file.path)
  const response = await axios.post(pythonServerUrl, fileStream, {
    headers: {
      'Content-Type': 'application/pdf'
    }
  })
  return response
}

module.exports.parseResume = parseResume

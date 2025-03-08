const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    const fileBuffer = req.file.buffer;
    const mimeType = fileType === 'application/pdf' ? 'application/pdf' : fileType;

    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: mimeType,
        },
      },
      'Extract information into structured output formats',
    ]);

    console.log('AI Summary:', result.response.text());

    res.json({ message: 'File upload successful', summary: result.response.text() });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

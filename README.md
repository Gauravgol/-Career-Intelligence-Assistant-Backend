# Resume Match AI

Resume Match AI is a full-stack resume analysis tool that compares a candidate resume against a job description using a selected LLM provider. It extracts text from uploaded documents, sends the resume and job description to an AI model, and returns structured hiring insights such as match score, skill gaps, experience alignment, and interview questions.

## Features

- Upload resume and job description files from the browser
- Supports PDF, DOCX, and TXT text extraction
- Choose between OpenAI, Gemini, and Anthropic/Claude providers
- Bring-your-own API key flow
- Structured JSON analysis response
- User-friendly API error messages for upload, provider, quota, model, and API key issues
- React + Vite frontend with Express backend

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express |
| Uploads | Multer memory storage |
| Document parsing | pdf-parse, mammoth |
| AI Providers | OpenAI, Google Gemini, Anthropic Claude |

## Project Structure

```text
.
|-- Frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- App.css
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- src/
|   |-- controllers/
|   |   `-- analyzeResume.controller.js
|   |-- middleware/
|   |   `-- upload.middleware.js
|   |-- routes/
|   |   `-- router.js
|   |-- services/
|   |   |-- claude.service.js
|   |   |-- gemini.service.js
|   |   `-- openai.service.js
|   |-- utils/
|   |   `-- extractText.js
|   `-- app.js
|-- server.js
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- API key for at least one supported provider:
  - OpenAI
  - Google Gemini
  - Anthropic

## Getting Started

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

### 3. Configure Environment

The frontend uses `VITE_API_BASE_URL` to call the backend. Create `Frontend/.env` when the API is not running on the default URL.

```env
VITE_API_BASE_URL=http://localhost:5000
```

The backend receives provider API keys from the request body, so no provider API keys are required in the backend `.env` for local use.

### 4. Start the Backend

From the project root:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### 5. Start the Frontend

From the `Frontend` directory:

```bash
npm run dev
```

Vite will print the local frontend URL, usually:

```text
http://localhost:5173
```

## API Reference

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "API is healthy"
}
```

### Analyze Resume

```http
POST /api/analyze
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `resume` | File | Yes | Candidate resume. Supports PDF, DOCX, TXT. |
| `jobDescription` | File | Yes | Job description file. Supports PDF, DOCX, TXT. |
| `provider` | String | Yes | `openai`, `gemini`, `claude`, or `anthropic`. |
| `model` | String | Yes | Model name supported by the selected provider. |
| `apiKey` | String | Yes | API key for the selected provider. |

Example:

```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@resume.pdf" \
  -F "jobDescription=@job-description.pdf" \
  -F "provider=openai" \
  -F "model=gpt-5-mini" \
  -F "apiKey=YOUR_API_KEY"
```

Successful response:

```json
{
  "success": true,
  "data": {
    "matchScore": 85,
    "summary": "The candidate is a strong fit for the role.",
    "matchingSkills": ["React", "Node.js", "API integration"],
    "missingSkills": ["AWS"],
    "experienceAlignment": "The candidate has relevant full-stack experience.",
    "interviewQuestions": [
      "Describe a time you integrated a third-party AI API."
    ]
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Your API key could not be verified. Please check the key and try again."
}
```

## Supported Uploads

- PDF: `.pdf`
- Microsoft Word: `.docx`
- Plain text: `.txt`
- Maximum file size: 10 MB per file

## Scripts

Backend:

```bash
npm run dev
```

Frontend:

```bash
cd Frontend
npm run dev
npm run build
npm run lint
npm run preview
```

## Error Handling

The API returns safe, user-readable errors instead of raw provider or server messages. Common cases include:

- Missing resume or job description
- Missing provider, model, or API key
- Unsupported file type
- File size over 10 MB
- Invalid API key
- Unsupported provider model
- Provider quota or rate limit issues
- Provider network or timeout failures
- AI response parsing failures

Detailed errors are still logged on the server for debugging.

## Security Notes

- API keys are submitted by the user at request time.
- API keys are not stored by the backend.
- Uploaded files are held in memory by Multer and are not persisted to disk by the current implementation.
- Do not log request bodies in production because they may contain API keys or private resume data.

## Production Checklist

- Add request rate limiting
- Add authentication if the API will be publicly exposed
- Validate model names per provider
- Add centralized logging and monitoring
- Add automated tests for upload validation and provider error mapping
- Use HTTPS in production
- Configure CORS for trusted frontend origins only
- Add file content scanning if accepting public uploads

## Troubleshooting

### Frontend Cannot Connect to API

Check that the backend is running on `http://localhost:5000` and that `Frontend/.env` has the correct `VITE_API_BASE_URL`.

### Unsupported Provider Error

Use one of the supported provider values: `openai`, `gemini`, `claude`, or `anthropic`.

### Invalid API Key Error

Confirm that the key belongs to the selected provider and has access to the selected model.

### AI Response Could Not Be Read

The provider may have returned non-JSON output. Retry the request or use a model that follows JSON instructions more reliably.

## License

This project is licensed under ISC.

# BeyondChats Article Intelligence Platform

## Live Project Links

Frontend: https://article-scraper-gules.vercel.app/  
Backend API: https://article-scraper-mkid.onrender.com/ 

Note: Backend may take a few seconds to wake up due to free-tier hosting.

## Overview

A full-stack automated content enhancement system that fetches articles from the BeyondChats blog, searches for competitor content using Google Custom Search API, and uses Google Gemini AI to rewrite and enrich articles with better SEO and readability.

## 🏗 Architecture

### Frontend (React + Vite)
- **Articles Page**: Displays original vs AI-enhanced content with toggle buttons
- **Analytics Dashboard**: Real-time statistics (total articles, enhanced count pending count, last updated)
- **Settings Page**: Manual triggers for content fetching and AI enhancement
- **Premium UI**: Dark theme, glassmorphism effects, Framer Motion animations
- **Tech Stack**: React Router, Axios, Lucide Icons, Modern CSS Variables

### Backend (Node.js + Express)
- **API Layer**: RESTful endpoints for CRUD operations and pipeline triggers
- **Content Fetching**:
  - `blogCrawler.js`: Fetches latest articles from BeyondChats.com/blogs/, skips duplicates
  - `scraper.js`: Extracts full text content from article URLs
- **Search Engine**: 
  - `googleSearch.js`: Uses Google Custom Search API to find competitor articles
- **AI Engine**: 
  - `llm.js`: Integrates Google Gemini 3 Flash Preview for content enhancement
  - Validates output before marking as enhanced
- **Database**: MongoDB (Mongoose) with automatic timestamps

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas connection)
- Google Gemini API Key
- Google Custom Search API Key + Search Engine ID

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/beyondchats
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

Access the application at `http://localhost:5173`

---

## 🔄 Workflow

### 1. Fetch Articles
Click **"Fetch Now"** in Settings page:
- Crawls `beyondchats.com/blogs/`
- Checks each article against database
- Only imports NEW articles (skips duplicates)
- Extracts full content using Cheerio

### 2. Enhance with AI
Click **"Enhance with AI"** in Settings page:
- Finds pending articles (`isUpdated: false`)
- For each article:
  - Searches Google Custom Search API for competitor content
  - Scrapes top 2 competitor articles
  - Sends context to Gemini 1.5 Flash
  - Validates enhanced content
  - Saves to database only if content changed
- Shows completion modal with results (X enhanced, Y skipped)

### 3. Review Enhanced Content
- **Articles Page**: View all articles with "Not Enhanced" badges for pending items
- Click "AI Enhanced" / "Original" toggle to compare content
- **Analytics Page**: Track total, enhanced, and pending article counts

---

## 🛠 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/articles` | GET | List all articles with pagination |
| `/api/articles/stats` | GET | Get article statistics (total, enhanced, pending, lastUpdated) |
| `/api/articles/:id` | GET | Get single article by ID |
| `/api/articles/scrape` | POST | Fetch new articles from BeyondChats blog |
| `/api/process` | POST | Run AI enhancement pipeline (synchronous, waits for completion) |

---

## 🎨 Features

### Frontend
- ✅ Responsive dark theme with glassmorphism effects
- ✅ Article cards with "Not Enhanced" status badges
- ✅ Real-time analytics dashboard
- ✅ Modal notifications for user feedback
- ✅ Environment variable support for API URLs
- ✅ Smooth animations with Framer Motion

### Backend
- ✅ Google Custom Search API integration (100 queries/day free tier)
- ✅ Duplicate detection (skips existing articles)
- ✅ Content validation (only saves if actually enhanced)
- ✅ Detailed console logging with emoji indicators
- ✅ Automatic timestamp tracking
- ✅ Error handling with fallback mechanisms

---

## 📦 Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `@google/generative-ai` - Gemini AI SDK
- `axios` - HTTP client
- `cheerio` - HTML parsing
- `dotenv` - Environment variables
- `cors` - Cross-origin support

### Frontend
- `react` + `react-dom` - UI framework
- `react-router-dom` - Routing
- `axios` - API requests
- `framer-motion` - Animations
- `lucide-react` - Icon library
- `react-markdown` - Markdown rendering

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/beyondchats
GEMINI_API_KEY=<your-gemini-api-key>
GOOGLE_SEARCH_API_KEY=<your-google-custom-search-api-key>
GOOGLE_SEARCH_ENGINE_ID=<your-search-engine-id>
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

For production deployment on Vercel, set `VITE_API_URL` to your backend URL.

---

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables in Render dashboard
4. Deploy from repository

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set `VITE_API_URL` environment variable to production backend URL
4. Deploy automatically on push

---

## 📝 Notes

- Google Custom Search API free tier: 100 queries/day
- Gemini API free tier: 15 requests/minute, 1500 requests/day
- Articles are only marked as enhanced if content actually changes
- Modal notifications show real-time progress and results
- Duplicate articles are automatically skipped during fetching

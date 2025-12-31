# BeyondChats Article Intelligence Platform

This project is a full-stack automated content enhancement system. It crawls articles from the BeyondChats blog, researches related competitor content using DuckDuckGo, and uses Google Gemini 1.5 to rewrite and enrich the articles for better SEO and readability.

## 🏗 Architecture

The system operates as a Monorepo with two main services:

1.  **Frontend (React + Vite)**
    *   **Dashboard**: Displays original vs. AI-enhanced content side-by-side.
    *   **Controls**: Provides UI triggers for scraping new articles and running the AI pipeline.
    *   **Tech**: React Router, Axios, Lucide Icons, Modern CSS Variables (Dark Theme).

2.  **Backend (Node.js + Express)**
    *   **API Layer**: Handles CRUD operations and exposes endpoints for frontend triggers.
    *   **Scraper Engine**:
        *   `blogCrawler.js`: Fetches latest articles from BeyondChats.com.
        *   `scraper.js`: Scrapes full text from competitor URLs (searched via DuckDuckGo).
    *   **AI Engine**: Integrates `@google/generative-ai` to process content.
    *   **Database**: MongoDB (Mongoose) stores article metadata, original content, and enhanced versions.

---

## 🚀 Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Running locally on default port 27017)
*   Google Gemini API Key

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/beyondchats
GEMINI_API_KEY=your_actual_api_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
Access the application at `http://localhost:5173` (or port 3000).

---

## 🔄 Workflow

1.  **Fetch Articles**: Click **"Fetch New Articles"** in the sidebar. The backend crawls `beyondchats.com/blog/` and saves the top 5 most recent posts to MongoDB.
2.  **Pipeline Analysis**: Click **"Run AI Worker"**.
    *   The system identifies pending articles.
    *   Searches DuckDuckGo for the article title.
    *   Scrapes content from the top 2 competitor results.
    *   Sends all context to Gemini 1.5 Flash.
3.  **Review**: The AI-generated content is saved. View it on the dashboard by clicking "View Details" on any article.

---

## 🛠 API Reference

| Endpoint | Method | Function |
| :--- | :--- | :--- |
| `/api/articles` | GET | List all articles. |
| `/api/articles/scrape` | POST | Trigger blog crawler (fetches 5 new posts). |
| `/api/process` | POST | Trigger AI enrichment pipeline (background task). |
| `/api/articles/:id` | GET | Get single article details. |

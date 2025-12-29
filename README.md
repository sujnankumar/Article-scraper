# BeyondChats Assignment - Full Stack Web Developer Intern

This project is a 3-phase assignment for the BeyondChats Full Stack Web Developer Intern position. It involves scraping articles, processing them with an LLM, and displaying them in a professional web interface.

## Project Structure

This is a monorepo containing:

- `/backend`: Laravel-based APIs for article management (Phase 1).
- `/worker`: Node.js-based worker script for Google Search, scraping, and LLM processing (Phase 2).
- `/frontend`: React-based frontend for displaying original and updated articles (Phase 3).

## Assignment Phases

### Phase 1: Scraping and CRUD APIs
- Scrape 5 oldest articles from BeyondChats blogs.
- Store in a database and expose via CRUD APIs.

### Phase 2: AI-Powered Enrichment
- Fetch articles from CRUD APIs.
- Search related content on Google.
- Scrape content from top results.
- Use an LLM to update original articles with improved formatting and content.

### Phase 3: Frontend Interface
- Create a responsive UI to display both original and AI-updated articles.

---
*Assigned for BeyondChats Internship Round.*

## Full Stack Article Processing Platform

This project is a **full-stack monorepo** that demonstrates article scraping, AI-powered content enhancement, and a modern web interface for viewing both original and processed content.

The system is designed to:

* Collect articles from external sources
* Store and manage them via APIs
* Enrich content using Large Language Models (LLMs)
* Present results in a clean, responsive frontend

---

## Project Structure

This repository is organized as a **monorepo** with three main components:

```
/
├── backend/    # API layer for article management
├── worker/     # Background worker for scraping and AI processing
└── frontend/   # Web interface for displaying articles
```

### backend

* Exposes REST APIs for managing articles
* Handles storage of original and AI-updated articles
* Supports full CRUD operations

### worker

* Fetches articles from backend APIs
* Searches for related content on Google
* Scrapes external articles for reference
* Uses an LLM to enhance and reformat original content
* Publishes updated articles back to the backend

### frontend

* Fetches articles from backend APIs
* Displays original and AI-enhanced articles
* Fully responsive and optimized for modern browsers

---

## Application Workflow

1. Articles are scraped and stored via backend services
2. The worker processes articles using search, scraping, and AI enrichment
3. Updated articles are saved alongside original versions
4. The frontend displays both versions in a structured UI

---

## Features

* Article scraping and storage
* RESTful API design
* Automated content enrichment using LLMs
* Reference citation for enriched content
* Responsive and modern frontend
* Clear separation of concerns across services

---

## Tech Stack

* Backend: API framework with database
* Worker: Node.js, web scraping, LLM integration
* Frontend: React, responsive UI design

---

## Setup & Usage

Each folder (`backend`, `worker`, `frontend`) contains its own setup instructions and environment configuration.

Refer to the individual README files inside each directory for:

* Local setup
* Environment variables
* Running services

---

## Architecture Overview

The system follows a service-oriented architecture:

* Backend handles data persistence and APIs
* Worker acts as an asynchronous processing layer
* Frontend consumes APIs for presentation

This design ensures scalability, maintainability, and clear responsibility boundaries.

# Architecture Decisions - Cavius Technology Platform

This document outlines the architectural decisions and design patterns implemented in the Cavius Technology project.

## 🏛️ System Architecture Overview

The platform is built using a decoupled **Client-Server Architecture** (Monorepo), consisting of a Next.js frontend and a Node.js/Express backend. This ensures a clear separation of concerns, scalability, and ease of deployment.

### 1. Monorepo Structure
We chose a monorepo approach (`/frontend` and `/backend`) to keep the related codebase together while allowing them to run as independent services. This simplifies environment management and version control for full-stack development.

### 2. Frontend Decisions (Next.js & React)
- **Framework**: **Next.js 16+ (App Router)** was selected for its superior performance, automatic code splitting, and built-in API routing capabilities.
- **Styling**: **Tailwind CSS** was utilized for a utility-first approach. We implemented a **Glassmorphism Design System** to create a premium, modern aesthetic that feels responsive and high-end.
- **State Management**: **React Context API** is used for global state management (e.g., AuthContext), avoiding the complexity of Redux for a project of this scale while maintaining clean state across the dashboard and landing pages.
- **Data Fetching**: **Axios** was chosen over Fetch for better error handling, interceptors (useful for adding JWT to headers), and broader browser compatibility.

### 3. Backend Decisions (Node.js & Express)
- **Framework**: **Express.js** provides a lightweight and flexible foundation for building RESTful APIs.
- **Database**: **MongoDB (via Mongoose)** was selected for its schema flexibility, which is ideal for evolving features like dynamic blog posts and user profiles.
- **Authentication**: **JWT (JSON Web Tokens)** are used for stateless authentication. This allows the backend to be horizontally scalable since it doesn't need to store session data in memory.
- **Security**: 
  - **Bcrypt.js** for secure password hashing.
  - **CORS** middleware for cross-origin security.
  - **Joi** for robust schema-based request validation.

### 4. AI Integration Strategy
- The application implements a flexible **AI Service Layer**. 
- We use a wrapper around **Google Gemini API** (aliased as `callAnthropic` in some legacy test cases for compatibility) to provide intelligent features like content generation and analysis.
- The AI logic is abstracted into `src/config/ai.js`, allowing for easy swapping between different LLM providers (e.g., Anthropic Claude vs. Google Gemini) in the future.

### 5. Deployment Efficiency
- Environment variables are strictly separated (`.env` for backend, `.env.local` for frontend) to follow the **12-Factor App** methodology.
- Pre-configured `.gitignore` files ensure sensitive information (like API keys) and large dependency folders (`node_modules`) are never committed to version control.

---
Developed as part of the Cavius Technology Internship Assignment.

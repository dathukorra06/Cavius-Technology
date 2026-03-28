# Cavius Technology Platform demo link:- https://drive.google.com/file/d/1RSquPyUASaEB-bTpJlgMYI0p6bt2el1N/view?usp=sharing

A modern, full-stack application featuring a high-performance backend and a premium, responsive frontend with AI integration and sleek glassmorphism design.

## 🚀 Project Overview

Cavius Technology is a comprehensive platform built with a focus on user experience and advanced features. It includes a robust authentication system, AI-powered tools, and a dynamic dashboard for efficient management and content creation.

### Key Features

- **Authentication**: Secure JWT-based authentication for user registration and login.
- **AI Integration**: Leverages advanced AI models (Claude/Gemini) for intelligent content generation and analysis.
- **Dashboard**: A premium, responsive interface with administrative and user-facing features.
- **Blog Management**: Full-featured blog platform with creative capabilities.
- **Modern UI**: Designed with glassmorphism, smooth animations, and a focus on visual excellence using Next.js and Tailwind CSS.

## 📁 Project Structure

```bash
cavius-technology/
├── backend/          # Node.js/Express API server
│   ├── src/          # Source code for backend
│   └── .env          # Backend environment variables
└── frontend/         # Next.js web application
    ├── app/          # Next.js App Router files
    ├── components/   # Reusable UI components
    └── .env.local    # Frontend environment variables
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context / Hooks
- **Data Fetching**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Security**: JWT (JSON Web Tokens), Bcrypt.js
- **Validation**: Joi

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account/cluster
- API keys for AI services (Anthropic/Google Gemini)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cavius-technology
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example and add your credentials
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file based on .env.example
   npm run dev
   ```

## 📝 Environment Variables

Ensure you configure the following environment variables for both backend and frontend:

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for token signing
- `AI_API_KEY`: API key for Claude/Gemini

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:5000/api)

---

Developed with ❤️ by the Cavius Technology Team.

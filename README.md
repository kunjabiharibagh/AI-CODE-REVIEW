# 🤖 CodeSense AI — AI-Powered Code Review Platform

A full stack web application that analyzes source code in real-time,
detects errors, and provides intelligent improvement suggestions
using Machine Learning and Groq AI (Llama3).

![CodeSense AI](https://img.shields.io/badge/CodeSense-AI-7c3aed)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Groq](https://img.shields.io/badge/Groq-AI-orange)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT + Bcrypt password hashing
- ⚡ **Real-Time ML Analysis** — Instant feedback as you type
- 🤖 **AI Code Review** — Powered by Groq AI (Llama3)
- 📊 **Code Quality Score** — ML-based scoring system
- 🐛 **Bug Detection** — Pattern-based ML bug finder
- 🔍 **Language Detection** — Auto detects programming language
- 📋 **Review History** — Saves all past reviews in MongoDB
- 🔒 **Security** — CORS, Rate limiting, Helmet, Input validation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router | Navigation |
| Axios | HTTP Requests |
| Custom ML | Real-time Analysis |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcryptjs | Password Hashing |
| Groq AI | Code Analysis |
| Express Validator | Input Validation |

---

## 🧠 ML Features

| Feature | Algorithm |
|---|---|
| Language Detection | Pattern Matching ML |
| Complexity Analysis | Cyclomatic Complexity |
| Bug Detection | Rule-based ML Patterns |
| Code Metrics | Statistical Analysis |
| Quality Score | Combined ML Score |

---

## 📁 Project Structure
AI-CODE-REVIEW/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── codeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── codeRoutes.js
│   └── server.js
└── frontend/
└── src/
├── components/
│   └── RealTimeFeedback.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── services/
│   ├── api.js
│   └── mlAnalyzer.js
└── App.jsx

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key

### 1 — Clone Repository
```bash
git clone https://github.com/kunjabiharibagh/AI-CODE-REVIEW.git
cd AI-CODE-REVIEW
```

### 2 — Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 3 — Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4 — Open App

http://localhost:5173

---

## 🔒 Security Features

- JWT token authentication
- Bcrypt password hashing (salt rounds: 12)
- CORS protection
- Rate limiting (100 req/15min)
- Input validation
- Environment variables for secrets
- Password never returned in API responses

---

## 📱 Screenshots

### Login Page
> Secure authentication with JWT

### Dashboard
> Real-time ML analysis + AI code review

### Review History
> All past reviews saved in MongoDB

---

## 🌐 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register user | ❌ |
| POST | /api/auth/login | Login user | ❌ |
| GET | /api/auth/profile | Get profile | ✅ |

### Code Routes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/code/review | Analyze code | ✅ |
| GET | /api/code/history | Get history | ✅ |
| GET | /api/code/history/:id | Get review | ✅ |

---

## 👨‍💻 Developer

**Kunja Bihari Bagh**
- GitHub: [@kunjabiharibagh](https://github.com/kunjabiharibagh)
- Institution: GIET University, Gunupur

---

## 📄 License

MIT License — feel free to use for learning purposes.


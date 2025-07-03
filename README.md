# NYT Books Explorer

A full-stack web application that lets users search bestselling books using the New York Times Books API, leave star ratings, and add comments. Includes user authentication and a responsive UI built with React and TailwindCSS.

This project was created as part of a programming challenge to demonstrate full-stack development skills.

---

## Features

### Backend (Node.js + Express)
- Acts as a proxy to the [NYT Books API](https://developer.nytimes.com/docs/books-product/1/overview)
- Provides search functionality with caching
- Implements full CRUD for:
  - Star ratings
  - Comments
- JWT-based user authentication
- MongoDB for data storage

### Frontend (React + Vite + TailwindCSS)
- Book search interface
- Star-based rating system
- Comment section with edit/delete functionality
- Login and registration forms
- Responsive design with TailwindCSS

---

## Tech Stack

| Layer        |              Tools              |
|--------------|---------------------------------|
| Frontend     | React, Vite, TailwindCSS, Axios |
| Backend      | Express, Node.js, Mongoose, JWT |
| Database     | MongoDB Atlas                   |
| External API | NYT Books API                   |
| Styling      | TailwindCSS                     |
| Animations   | Framer Motion                   |

---

# 🛠 Setup Instructions

> These steps assume you have **Node.js**, **npm**, and **MongoDB** installed.

---

## 1. Clone the Repository

```bash
git clone https://github.com/AIOMEGA/nyt-books-app.git
cd nyt-books-app
```

## 2. Set Up the Backend (Server)

```bash
cd server
npm install
```

### Create a .env file in /server

```bash
NYT_API_KEY=your_nyt_api_key
MONGODB_URI=mongodb://localhost:27017/nytbooks
JWT_SECRET=your_jwt_secret
```

### Then start the server:

```bash
npm start
```
## 3. Set Up the Frontend (Client)

```bash
cd ../client
npm install
```

### Then start the development server

```bash
npm run dev
```
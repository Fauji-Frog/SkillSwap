# SkillSwap - Simple Skill Exchange MVP

Built with simplicity in mind: The project was originally developed under a strict code-size constraint for an academic lab. Instead of adding unnecessary complexity, the focus was on delivering meaningful functionality with a compact and maintainable implementation.

A very small React + Node.js + Express + MySQL project.

## Features
- Basic signup: name, email, password, student ID, batch, phone, description
- Basic login: email + password
- Create a SkillSwap post: skill to teach + skill to learn
- Browse all posts
- Connect button shows the other student's phone number
- No payment, chat, admin panel, or complicated authentication

## MySQL
Create the database and tables using `database.sql`.

## Backend
```bash
cd backend
npm install
node server.js
```

Backend runs on port 5000.

## Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

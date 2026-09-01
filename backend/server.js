const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // promise সাপোর্ট সহ mysql2

const app = express();
app.use(cors());
app.use(express.json());

// createConnection-এর বদলে Connection Pool ব্যবহার করা হয়েছে
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "skillswap",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// সার্ভার কানেকশন টেস্ট
db.getConnection()
  .then(conn => {
    console.log("MySQL Pool Connected!");
    conn.release();
  })
  .catch(err => console.log("DB error:", err.message));

app.get("/", (req, res) => res.json({ message: "SkillSwap API is running" }));

// ১. সাইনআপ রাউট
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, student_id, batch, phone, description } = req.body;
    const [result] = await db.query(
      `INSERT INTO users (name,email,password,student_id,batch,phone,description) VALUES (?,?,?,?,?,?,?)`,
      [name, email, password, student_id, batch, phone, description]
    );
    res.json({ message: "Signup successful", userId: result.insertId });
  } catch (err) {
    res.status(400).json({ message: "Email already exists or invalid data" });
  }
});

// ২. লগইন রাউট
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Provide email and password" });

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email=? AND password=?",
      [email, password]
    );

    if (!rows.length) return res.status(401).json({ message: "Invalid email or password" });

    const u = rows[0];
    res.json({
      id: u.id,
      name: u.name,
      email: u.email,
      student_id: u.student_id,
      batch: u.batch,
      phone: u.phone,
      description: u.description
    });
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

// ৩. পোস্ট তৈরি রাউট
app.post("/api/posts", async (req, res) => {
  try {
    const { user_id, teach_skill, learn_skill, description } = req.body;
    const [result] = await db.query(
      "INSERT INTO posts(user_id,teach_skill,learn_skill,description) VALUES(?,?,?,?)",
      [user_id, teach_skill, learn_skill, description]
    );
    res.json({ message: "Skill posted", id: result.insertId });
  } catch (err) {
    res.status(400).json({ message: "Could not create post" });
  }
});

// ৪. পোস্ট লিস্ট ও সার্চ ডাটা রাউট
app.get("/api/posts", async (req, res) => {
  try {
    const sql = `SELECT p.*, u.name, u.student_id, u.batch, u.phone, u.description AS profile_description
                 FROM posts p JOIN users u ON p.user_id=u.id ORDER BY p.id DESC`;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

app.listen(5000, () => console.log("SkillSwap server running on port 5000"));
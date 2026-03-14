// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "web.html"));
});

app.post("/waitlist", (req, res) => {
  const email = (req.body?.email || "").trim();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const databaseDir = path.join(__dirname, "database");
  const usersFile = path.join(databaseDir, "users.json");

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  }

  users.push({ email });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  return res.json({ message: "User added to waitlist" });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});

const fs = require("fs");
const path = require("path");

function parseBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (_error) {
      return {};
    }
  }

  return {};
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = parseBody(req);
  const email = String(body.email || "").trim();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Vercel functions have writable temporary storage only.
  const tmpDir = "/tmp";
  const usersFile = path.join(tmpDir, "users.json");

  let users = [];
  if (fs.existsSync(usersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    } catch (_error) {
      users = [];
    }
  }

  users.push({ email, createdAt: new Date().toISOString() });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  return res.status(200).json({ message: "User added to waitlist" });
};

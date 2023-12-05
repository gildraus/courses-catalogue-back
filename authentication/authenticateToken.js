const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key"; // Replace with your own secret key

function authenticateToken(req, res, next) {
  // Get the token from the request headers or query parameter
  const token = req.headers["authorization"] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  // Verify and decode the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    // Token is valid, add the decoded data to the request object
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;

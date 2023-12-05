// authMiddleware.js

const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

function authenticateToken(req, res, next) {

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) {
   
    return res.status(401).json({ message: 'No token provided' });
  }


  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next(); 
  });
}

module.exports = authenticateToken;
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Get token from header (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // The payload could be { user: ... } or just { id, role }. This handles both.
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
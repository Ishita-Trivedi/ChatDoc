const { getAuth } = require('@clerk/express');

const requireApiAuth = (req, res, next) => {
  if (process.env.CLERK_SECRET_KEY) {
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated || !userId) return res.status(401).json({ error: 'Authentication required.' });
    req.userId = userId;
    return next();
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(503).json({ error: 'Server authentication is not configured.' });
  }
  req.userId = req.get('x-chatdoc-user') || 'local-development-user';
  return next();
};

module.exports = { requireApiAuth };

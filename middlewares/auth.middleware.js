const jwt = require('jsonwebtoken')

const authorization = (req, res, next) => {
  try {
    const header = req.get('Authorization')
    if(!header) {
      const error = new Error
      error.status = 401
      error.message = "Request without token"
      throw error
    };
    const token = header.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {... decodedToken}
    next();
  } catch (error) {
    res.status(error.status || 500).json({ Error: error.message });
  };
};

module.exports = authorization;
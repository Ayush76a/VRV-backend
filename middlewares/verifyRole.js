// Middleware to verify the role of the user
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      // console.log("role is : ", localStorage.getItem('userRole'))
      res.status(403).json({ message: 'Access denied, Your role is not allowed.' });
    }
  };
};

module.exports = verifyRole;

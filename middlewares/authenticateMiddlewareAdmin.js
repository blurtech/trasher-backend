const passport = require('passport');

module.exports = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user || user.role !== "admin") {
      return res.unauthorized();
    }
    req.user = user;
    return next();
  })(req, res, next);
};

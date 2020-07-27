const User = require('../models/user');

const deserializeUser = (req, res, next) => {
  if (req.session) {
    const id = req.session.userId;

    User.findById(id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(error => {
        next(error);
      });
  } else {
    next();
  }
};
module.exports = deserializeUser;

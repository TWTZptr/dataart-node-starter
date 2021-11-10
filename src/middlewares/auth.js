const passport = require('passport');
const BearerStrategy = require('passport-http-bearer');
const jwt = require('jsonwebtoken');
const { AUTH } = require('../config');
const userService = require('../modules/user/service');
const { UnauthorizedError } = require('../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('../modules/auth/constants');

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      jwt.verify(token, AUTH.SECRET);
      const decoded = jwt.decode(token, AUTH.SECRET);
      if (!decoded) {
        return done(null, false);
      }

      const user = await userService.getUser(decoded);
      user.password = undefined;
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
    }
  }),
);

module.exports = (req, res, next) => {
  passport.authenticate('bearer', { session: false })(req, res, next);
};

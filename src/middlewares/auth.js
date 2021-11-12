const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { AUTH } = require('../config');
const userService = require('../modules/user/service');
const { UnauthorizedError } = require('../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('../modules/auth/constants');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH.SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userService.getUser({ id: payload.id });
        return done(null, user);
      } catch (e) {
        return done(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }
    },
  ),
);

module.exports = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err || !user || info) {
      return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
    }
    user.password = undefined;
    req.user = user;
    next();
  })(req, res, next);
};

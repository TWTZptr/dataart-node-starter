const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { AUTH } = require('../config');
const userService = require('../modules/user/service');
const { UnauthorizedError } = require('../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('../modules/auth/constants');
const jwt = require('jsonwebtoken');

passport.use(
  'jwtAccessToken',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH.ACCESS_TOKEN_SECRET,
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

passport.use(
  'jwtRefreshToken',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.refreshToken]),
      secretOrKey: AUTH.REFRESH_TOKEN_SECRET,
    },
    async (payload, done) => {
      done(payload);
    },
  ),
);

module.exports = {
  access: (req, res, next) => {
    passport.authenticate('jwtAccessToken', (err, user, info) => {
      if (err || !user) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }
      user.password = undefined;
      req.user = user;
      return next();
    })(req, res, next);
  },
  refresh: (req, res, next) => {
    passport.authenticate('jwtRefreshToken', (user, err, info) => {
      if (err || !user) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }

      let accessTokenPayload = null;
      try {
        const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
        const accessToken = extractor(req);
        accessTokenPayload = jwt.decode(accessToken);
      } catch (e) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }

      if (accessTokenPayload.id !== user.id) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }
      req.user = user;
      return next();
    })(req, res, next);
  },
};

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { AUTH } = require('../config');
const userService = require('../modules/user/service');
const { UnauthorizedError } = require('../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('../modules/auth/constants');
const jwt = require('jsonwebtoken');

const verifyCallback = async (payload, done) => {
  try {
    const user = await userService.getUser({ id: payload.id });
    return done(null, user);
  } catch (e) {
    return done(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
  }
};

const refreshTokenfromCookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.refreshToken;
  }
  return token;
};

passport.use(
  'jwtAccessToken',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH.ACCESS_TOKEN_SECRET,
    },
    verifyCallback,
  ),
);

passport.use(
  'jwtRefreshToken',
  new JwtStrategy(
    {
      jwtFromRequest: refreshTokenfromCookieExtractor,
      secretOrKey: AUTH.REFRESH_TOKEN_SECRET,
    },
    verifyCallback,
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
    passport.authenticate('jwtRefreshToken', (err, user, info) => {
      if (err || !user) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }

      let accessTokenPayload = null;
      try {
        accessTokenPayload = jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken()(req));
      } catch (e) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }

      if (accessTokenPayload.id !== user.id) {
        return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
      }
      user.password = undefined;
      req.user = user;
      return next();
    })(req, res, next);
  },
};

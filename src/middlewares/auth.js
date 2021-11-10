const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { AUTH } = require('../config');
const userService = require('../modules/user/service');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH.SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userService.getUser({ id: payload.id });
        user.password = undefined;
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    },
  ),
);

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};

import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {ExtractJwt, Strategy as JWTStrategy} from 'passport-jwt';
import User from '../entities/User';
import {registerUser} from '../dao/userDAO';

passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req: any, email, password, done) => {
  try {
    const {token, error} = await registerUser({email, password});
    if (error) {
      return done(error);
    } else {
      req.token = token;
      return done(null, token);
    }
  } catch (err) {
    done(err);
  }
}));

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({email});
    if (!user) {
      return done(null, false, {message: 'User not found'});
    }
    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      return done(null, false, {message: 'Wrong credentials'});
    }
    return done(null, user, {message: 'Logged in successfully'});
  } catch (err) {
    return done(err);
  }
}));

passport.use(new JWTStrategy({
  secretOrKey: String(process.env.SECRET),
  // Extracts the token from the header : Authorization: Bearer <token>
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
  try {
    const user = await User.findOne({_id: token.user.id});
    if (!user) {
      return done(new Error('Unauthorized'));
    }
    const isAuthenticated = await user.isAuthenticated();
    if (!isAuthenticated) {
      return done(new Error('Unauthenticated'));
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

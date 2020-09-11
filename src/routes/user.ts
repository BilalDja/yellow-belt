import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../entities/User';
import {logoutUser} from '../dao/userDao';

const userRouter = Router();

userRouter.get('/', async (_, res) => {
  const users = await User.find();
  res.json(users);
});

userRouter.get('/profile',
  passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    res.json({
      user: req.user,
      token: req.headers['authorization'],
    });
  });

userRouter.post('/register',
  async (req: any, res: any, next) => {
    passport.authenticate('register', {session: false}, (error, token) => {
      if (error) {
        return res.status(error.code || 400).json({error});
      }
      res.json({token});
    })(req, res, next);
  });

userRouter.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user) => {
    try {
      if (err || !user) {
        const error = new Error('Login error');
        return next(error);
      }
      req.login(user, {session: false}, (err) => {
        if (err) {
          next(err);
        }
        const payload = {id: user.id, email: user.email};
        const token = jwt.sign({user: payload}, String(process.env.SECRET));
        return res.json({token});
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

userRouter.post('/logout', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (error, user) => {
    if (error) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized'
      });
    }
    try {
      await logoutUser(user);
      res.status(200).json({message: 'logout successfully'})
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
})

export default userRouter;

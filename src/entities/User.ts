import mongoose, {Document} from 'mongoose';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import Token from './Token';

interface UserDoc extends Document {
  id: string;
  email: string;
  password: string;

  isValidPassword(password: string): Promise<boolean>;

  /**
   * this is an instance method that verifies if the user has a valid token in the database,
   * if he does it returns Promise<true>, Promise<false> otherwise.
   */
  isAuthenticated(): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: 'string',
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: 'string',
    required: true
  }
}, {timestamps: true});

// Mongoose hooks
userSchema.pre<UserDoc>('save', async function (next) {
  const user = this;
  this.password = await argon2.hash(user.password);
  next();
});

userSchema.methods.isAuthenticated = async function isAuthenticated() {
  // 'this' operator refers to the current instance of the user
  const token = await Token.findOne({userId: this.id});
  if (!token) {
    return false;
  }
  const decodedToken: any = jwt.verify(token.id, String(process.env.SECRET), {});
  if (decodedToken.user) {
    return true;
  }
  // Delete all accessTokens in te database if the use is not authenticated
  await Token.deleteMany({userId: this.id});
  return false;
}

userSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  return argon2.verify(user.password, password);
};

export default mongoose.model<UserDoc>('User', userSchema);

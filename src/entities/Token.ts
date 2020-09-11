import mongoose, {Document} from 'mongoose';
import jwt from 'jsonwebtoken';

interface TokenDoc extends Document {
  ttl?: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

const tokenSchema = new mongoose.Schema({
  _id: {
    type: 'string',
  },
  ttl: {
    type: 'number',
  },
  userId: {
    type: 'string',
    required: true
  }
}, {timestamps: true, _id: false, id: true});

tokenSchema.pre<TokenDoc>('save', function (next) {
  const ttl = 60 /*days*/ * 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/;// 2 months
  const payload = {
    id: this.userId,
  };
  this._id = jwt.sign({user: payload}, String(process.env.SECRET), {
    expiresIn: ttl
  });
  this.ttl = ttl;
  next();
});

export default mongoose.model<TokenDoc>('Token', tokenSchema);

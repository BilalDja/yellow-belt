import Joi from 'joi';
import User from '../entities/User';
import Token from '../entities/Token';

function validateUserCredentials(userData: any) {
  const schema = Joi.object({
    email: Joi.string().email({minDomainSegments: 2}).required()
      .messages({
        "any.required": "Email est requis",
        "string.email": "Email invalide",
      }),
    password: Joi.string().min(6).required()
      .messages({
        "any.required": "Le mot de passe est requis",
        "string.min": "Le mot de passe doit contenir au moin 6 caractères"
      }),
  });
  const {value, error} = schema.validate(userData, {abortEarly: false});
  return {value, error};
}

export const registerUser = async (userData: any): Promise<{ error?: any, token?: any }> => {
  const {value, error} = validateUserCredentials(userData);
  if (error) {
    return {error: {message: error.details[0].message, code: 422}};
  } else {
    const user = await User.create({
      ...value,
    })
      .catch((err: any) => {
        throw err;
      });
    const {id, createdAt, ttl, userId} = await Token.create({userId: user.id});
    return {token: {id, createdAt, ttl, userId}};
  }
};

export const loginUser = async (loginData: any): Promise<{ error?: any, token?: any }> => {
  const {value, error} = validateUserCredentials(loginData);
  if (error) {
    const {message} = error.details[0];
    return {error: {message, code: 422}};
  } else {
    const user = await User.findOne({email: value.email});
    const error = {
      code: 401,
      message: 'Informations d\'identification incorrectes',
    };
    if (!user) {
      return {error};
    }
    const isMatch = await user.isValidPassword(value.password);
    if (!isMatch) {
      return {error};
    }
    const {id, createdAt, ttl, userId} = await Token.create({userId: user.id});
    return {token: {id, createdAt, ttl, userId}};
  }
};

export const logoutUser = async (user: any): Promise<boolean> => {
  const res = await Token.deleteMany({userId: user.id});
  return !!res.ok;
}

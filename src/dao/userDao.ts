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

async function createToken(userIdParam: string): Promise<any> {
  const {id, createdAt, ttl, userId} = await Token.create({userId: userIdParam});
  return {token: {id, createdAt, ttl, userId}};
}

export const registerUser = async (userData: any): Promise<{ error?: any, token?: any }> => {
  const {value, error} = validateUserCredentials(userData);
  if (error) {
    return {error: {message: error.details[0].message, code: 422}};
  }
  const user = await User.create({
    ...value,
  })
    .catch((err: any) => {
      throw err;
    });
  return createToken(user.id);
};

export const loginUser = async (loginData: any): Promise<{ error?: any, token?: any }> => {
  const {value, error} = validateUserCredentials(loginData);
  if (error) {
    const {message} = error.details[0];
    return {error: {message, code: 422}};
  }
  const user = await User.findOne({email: value.email});
  const authError = {
    code: 401,
    message: 'Informations d\'identification incorrectes',
  };
  if (!user) {
    return {error: authError};
  }
  const isMatch = await user.isValidPassword(value.password);
  if (!isMatch) {
    return {error: authError};
  }
  return createToken(user.id);
};

export const logoutUser = async (user: any): Promise<boolean> => {
  const res = await Token.deleteMany({userId: user.id});
  return !!res.ok;
}

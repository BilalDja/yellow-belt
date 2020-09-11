import Joi from 'joi';
import User from '../entities/User';
import Token from '../entities/Token';

export const registerUser = async (userData: any): Promise<{ error?: any, token?: any }> => {
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

export const loginUser = async (loginData: any): Promise<{ errors?: any, token?: any }> => {
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
  const validationResult = schema.validate(loginData, {abortEarly: false});
  if (validationResult.error) {
    const errors = validationResult.error.details.map(({message, path}) => ({
      message,
      field: path[0],
    }));
    return {errors};
  } else {
    const validData = validationResult.value;
    const user = await User.findOne({email: validData.email});
    if (!user) {
      return {
        errors: [{
          field: 'authorization',
          message: 'Informations d\'identification incorrectes',
        }],
      };
    }
    const isMatch = await user.isValidPassword(validData.password);
    if (!isMatch) {
      return {
        errors: [{
          field: 'authorization',
          message: 'Informations d\'identification incorrectes',
        }],
      };
    }
    return {token: user};
  }
};

export const logoutUser = async (user: any): Promise<boolean> => {
  const res = await Token.deleteMany({userId: user.id});
  return !!res.ok;
}

import HttpException from './HttpException';
import {Request, Response} from 'express';


export const four0four = (_req: Request, _res: Response, next: Function) => {
  const error = new HttpException(404, 'Not found');
  next(error);
};
export const errorsHandler = (error: HttpException, _req: Request, res: Response, _next: Function) => {
  res.status(error.statusCode);
  res.json({
    message: error.message,
    statusCode: error.statusCode,
    stack: process.env.NODE_ENV === 'development' ? error.stack : null,
  });
}

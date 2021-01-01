import { Request, Response, NextFunction } from 'express';
export function authenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const token_bearer: string[] = req.headers.authorization.split(' ');

  if (token_bearer.length != 2) {
    return res.status(401).send({ message: 'Malformed token.' });
  }

  const token: string = token_bearer[1];

  if (token === process.env.AUTH_TOKEN) {
    return next();
  }
    return res.status(401).send({ auth: false, message: 'Unauthorized user' });
}
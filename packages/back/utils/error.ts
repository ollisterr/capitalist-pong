import { Response } from 'express';

export const invalidSession = (res: Response) => {
  return res.status(400).json({ message: 'Invalid Game ID', code: 400 });
};

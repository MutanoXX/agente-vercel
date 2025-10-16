// Vercel serverless function entry point
import { app } from '../server/src/app';
import { Request, Response } from 'express';

// Export the Express app as a serverless function
export default (req: Request, res: Response) => {
  return app(req, res);
};

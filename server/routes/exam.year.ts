import express, { Request, Response } from 'express';
import yearModel from '../models/Year.model';

const yearRouter = express.Router();

yearRouter.use(express.json());

// year routes
yearRouter.post('/addYear', async (req: Request, res: Response) => {
  try {
    const year = new yearModel(req.body);
    await year.save();
    res.status(201).send(year);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default yearRouter;

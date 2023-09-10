import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { connectToDatabase } from './utils/connectToDB';

import userRouter from './routes/user.route';
import postRouter from './routes/post.route';
import profileRouter from './routes/profile.route';
import commentRouter from './routes/comment.route';

import { handleError } from './middlewares/handleError';
import { deserializeUser } from './middlewares/deserializeUser';
import { validateUser } from './middlewares/validateUser';

const app = express();

const port = process.env.PORT;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.ORIGIN
        : 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(morgan('tiny'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', [deserializeUser, validateUser], postRouter);
app.use('/api/v1/comments', [deserializeUser, validateUser], commentRouter);
app.use('/api/v1/profiles', [deserializeUser, validateUser], profileRouter);

app.get('/api/v1/healthCheck', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(handleError);

app.listen(port, async () => {
  try {
    await connectToDatabase();
    console.log(
      `Server is running at ${
        process.env.NODE_ENV === 'production'
          ? 'https://fittbudy-server.onrender.com'
          : `http://localhost:${port}`
      }`
    );
  } catch (error: any) {
    console.error('Error occurred : ', error);
    process.exit(1);
  }
});

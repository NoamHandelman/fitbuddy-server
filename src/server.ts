import express, { Request, Response } from 'express';
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
const port = 4000;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
// }

app.use('/api/users', userRouter);
app.use('/api/posts', [deserializeUser, validateUser], postRouter);
app.use('/api/comments', [deserializeUser, validateUser], commentRouter);
app.use('/api/profiles', [deserializeUser, validateUser], profileRouter);

app.get('/healthCheck', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(handleError);

app.listen(port, async () => {
  try {
    await connectToDatabase();
    console.log(`Server is running at https://localhost:${port}`);
  } catch (error: any) {
    console.error('Error occurred : ', error);
    process.exit(1);
  }
});

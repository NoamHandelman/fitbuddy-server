import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('Database url variable was not found!');
    }
    await mongoose.connect(dbUrl);
    console.log('Connected to DB!');
  } catch (error) {
    console.error(error);
  }
};

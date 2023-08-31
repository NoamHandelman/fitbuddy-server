import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

dotenv.config();

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  comparePassword: (password: string) => Promise<boolean>;
  createAccessToken: () => string;
  deleteUser: (userId: string) => Promise<void>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide username!'],
    maxLength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  imageUrl: {
    type: String,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  const isValidPassword = await bcrypt.compare(password, this.password);
  return isValidPassword;
};

UserSchema.methods.createAccessToken = function () {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenSecretLifetime = process.env.ACCESS_TOKEN_SECRET_LIFETIME;
  if (!accessTokenSecret || !accessTokenSecretLifetime) {
    return console.error(
      'No access token secret or secret lifetime found in .env file!'
    );
  }

  return jwt.sign({ user: this._id }, accessTokenSecret, {
    expiresIn: accessTokenSecretLifetime,
  });
};

export default mongoose.model<IUser>('User', UserSchema);

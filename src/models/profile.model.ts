import mongoose from 'mongoose';
import { IUser } from './user.model';

const { Schema } = mongoose;

export interface IProfileDocument extends mongoose.Document {
  user: IUser['_id'];
  bio?: string;
  profession?: string;
  education?: string;
  birthDate?: Date;
  residence?: string;
  favoriteSport?: string;
}

const ProfileSchema = new Schema<IProfileDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user id!'],
  },
  bio: {
    type: String,
    trim: true,
  },
  profession: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    trim: true,
  },
  birthDate: {
    type: Date,
  },
  residence: {
    type: String,
    trim: true,
  },
  favoriteSport: {
    type: String,
    default: 'general',
  },
});

export default mongoose.model<IProfileDocument>('Profile', ProfileSchema);

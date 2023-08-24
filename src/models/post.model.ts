import mongoose from 'mongoose';
import { IUser } from './user.model';
import { ICommentDocument } from './comment.model';

const { Schema } = mongoose;

export interface IPostInput {
  user: IUser['_id'];
  text: string;
}

export interface IPostDocument extends mongoose.Document, IPostInput {
  likes: Array<{ user: IUser['_id'] }>;
  comments: Array<ICommentDocument['_id']>;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user id!'],
    },
    text: {
      type: String,
      required: [true, 'Please provide text for the post!'],
      trim: true,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'Please provide user id!'],
        },
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IPostDocument>('Post', PostSchema);

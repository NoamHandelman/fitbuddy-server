import mongoose from 'mongoose';
import { IUser } from './user.model';
import { IPostDocument } from './post.model';

const { Schema } = mongoose;

export interface ICommentInput {
  user: IUser['_id'];
  post: IPostDocument['_id'];
  text: string;
}

export interface ICommentDocument extends mongoose.Document, ICommentInput {
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user id!'],
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Please provide post id!'],
    },
    text: {
      type: String,
      required: [true, 'Please provide text for the post!'],
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICommentDocument>('Comment', CommentSchema);

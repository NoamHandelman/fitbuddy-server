import { Types } from 'mongoose';
import { UnauthorizedError } from '../custom-errors/Unauthorized';

export const validatePermissions = (
  ownerUser: Types.ObjectId,
  currentUser: string
) => {
  if (ownerUser.toString() === currentUser) return;
  throw new UnauthorizedError(
    'You do not have permission to perform this action'
  );
};

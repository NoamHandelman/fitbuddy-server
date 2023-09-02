import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

import dotenv from 'dotenv';
dotenv.config();

const initializeS3Client = () => {
  try {
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const s3BucketRegion = process.env.S3_BUCKET_REGION;
    const awsAccessKey = process.env.AWS_ACCESS_KEY;
    const awsSecretKey = process.env.AWS_SECRET_TOKEN_KEY;

    if (!s3BucketName || !s3BucketRegion || !awsAccessKey || !awsSecretKey) {
      throw new Error('Required environment variables are missing!');
    }

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
      region: s3BucketRegion,
    });

    return {
      s3BucketName,
      s3BucketRegion,
      awsAccessKey,
      awsSecretKey,
      s3Client,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const generateS3Url = async (file: Express.Multer.File) => {
  try {
    const s3 = initializeS3Client();

    const params = {
      Bucket: s3.s3BucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const putObjCommend = new PutObjectCommand(params);

    await s3.s3Client.send(putObjCommend);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteS3Image = async (originalName: string) => {
  try {
    const s3 = initializeS3Client();

    const deleteParams = {
      Bucket: s3.s3BucketName,
      Key: originalName,
    };

    const deleteObjCommend = new DeleteObjectCommand(deleteParams);

    await s3.s3Client.send(deleteObjCommend);

    const cloudFront = new CloudFrontClient({
      credentials: {
        accessKeyId: s3.awsAccessKey,
        secretAccessKey: s3.awsSecretKey,
      },
      region: s3.s3BucketRegion,
    });

    const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;

    if (!distributionId) {
      throw new Error('Distribution ID variable is missing!');
    }

    const invalidationParams = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: originalName,
        Paths: {
          Quantity: 1,
          Items: ['/' + originalName],
        },
      },
    };

    const invalidationCommand = new CreateInvalidationCommand(
      invalidationParams
    );

    await cloudFront.send(invalidationCommand);
  } catch (error: any) {
    throw new Error(error);
  }
};

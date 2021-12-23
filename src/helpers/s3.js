const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('../config');
const Hashids = require('hashids');

const s3 = new S3Client({ region: S3.REGION });
const hashids = new Hashids(S3.FILENAME_SALT);

const generateS3link = (filename) => {
  return `https://${S3.BUCKET_NAME}.s3.${S3.REGION}.amazonaws.com/${filename}`;
};

const s3uploader = async (stream, key, { contentType, contentLength }) => {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: S3.BUCKET_NAME,
      Key: key,
      Body: stream,
      ACL: 'public-read',
      ContentType: contentType,
    },
  });

  return upload.done();
};

const findObjectsByUserId = async (userId) => {
  const files = await s3.send(
    new ListObjectsV2Command({
      Bucket: S3.BUCKET_NAME,
      Prefix: `${hashids.encode(userId)}/`,
    }),
  );

  if (!files.Contents) {
    return [];
  }

  return files.Contents;
};

module.exports = {
  s3uploader,
  generateS3link,
  findObjectsByUserId,
};

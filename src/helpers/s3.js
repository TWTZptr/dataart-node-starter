const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const { S3 } = require('../config');
const { PassThrough } = require('stream');
const multiparty = require('multiparty');
const Hashids = require('hashids');
const { ValidationError } = require('../utils/errors');
const { FORBIDDEN_FILE_EXTENSION } = require('../modules/file/constants');

const s3 = new S3Client({ region: S3.REGION });
const hashids = new Hashids(S3.FILENAME_SALT);

const generateS3link = (filename) => {
  return `https://${S3.BUCKET_NAME}.s3.${S3.REGION}.amazonaws.com/${filename}`;
};

const s3Uploader = async (req, options = {}) => {
  return new Promise(async (resolve, reject) => {
    const form = new multiparty.Form();
    const filenames = [];
    const uploads = [];

    form.on('part', (part) => {
      if (part.filename) {
        const pass = new PassThrough();
        part.pipe(pass);

        const extension = part.filename.split('.').at(-1);
        if (options.extensions && !options.extensions.includes(extension)) {
          return reject(new ValidationError(FORBIDDEN_FILE_EXTENSION));
        }

        const filename = `${hashids.encode(req.user.id)}/${hashids.encode(
          req.user.id,
          Date.now(),
        )}.${extension}`;

        const upload = s3.send(
          new PutObjectCommand({
            Bucket: S3.BUCKET_NAME,
            Key: filename,
            Body: pass,
            ACL: 'public-read',
            ContentLength: part.byteCount - part.byteOffset,
            ContentType: part.headers['content-type'],
          }),
        );

        filenames.push(filename);
        uploads.push(upload);
      }

      part.resume();
    });

    form.on('error', (err) => {
      return reject(err);
    });

    form.on('close', async () => {
      await Promise.all(uploads);
      return resolve(filenames.map((filename) => generateS3link(filename)));
    });

    form.parse(req);
  });
};

const findObjectsByUserId = async (userId) => {
  const files = await s3.send(
    new ListObjectsV2Command({
      Bucket: S3.BUCKET_NAME,
      Prefix: `${hashids.encode(userId)}/`,
    }),
  );

  return files.Contents.map((file) => generateS3link(file.Key));
};

module.exports = {
  s3Uploader,
  generateS3link,
  findObjectsByUserId,
};

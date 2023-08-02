const { S3Client } = require('@aws-sdk/client-s3');

// Cấu hình AWS SDK với access key và secret key của bạn
const s3 = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: 'AKIASLYHUNUI46SPPV5Z',
        secretAccessKey: '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',
    },
});

module.exports = { s3 };

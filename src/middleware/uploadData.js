const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../aws/config');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const saveImageToS3 = async (file) => {
    const imageName = `${uuidv4()}_${file.originalname}`;

    const params = {
        Bucket: 'myblogimg1909',
        Key: imageName,
        Body: file.buffer,
        ContentType: 'image/*',
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return imageName;
};

module.exports = { upload, saveImageToS3 };

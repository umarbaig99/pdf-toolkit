const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

// Ensure uploads directory exists for local fallback
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

let upload;

// Check if AWS credentials are provided and valid (not placeholders)
const hasAwsCreds = process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID !== 'your_access_key_id';

if (hasAwsCreds) {
    const s3 = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                cb(null, `uploads/${Date.now()}-${path.basename(file.originalname)}`);
            }
        })
    });
    console.log('Using AWS S3 Storage');
} else {
    // Fallback to local storage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    upload = multer({ storage: storage });
    console.log('Using Local Disk Storage');
}

module.exports = upload;

const router = require("express").Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: 'AKIAR5LLTOTKAAEZDQ4B',
    secretAccessKey: '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',
    region: 'us-east-2'
  });
  
  // Multer S3 storage configuration
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'bazarmarketplace',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read', // Set the access control for the uploaded object
      key: function (req, file, cb) {
        const folder = 'uploads/' + req.loggedInUser.Merchant_ID + '/'; // Example: 'uploads/12345/'
        const fileName = Date.now().toString() + '-' + file.originalname;
        cb(null, folder + fileName);
      }
    })
  });
  
  // POST endpoint to upload a file to S3
  router.post('/upload-to-s3', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    res.status(200).send({ imageUrl: req.file.location }); // Send back the uploaded image URL
  });

  module.exports = router;
  

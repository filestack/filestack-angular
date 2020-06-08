const S3Plugin = require('webpack-s3-plugin');
const path = require('path');
const version = require('./projects/filestack-angular/package.json').version;

var config = {
  mode: 'production',
  entry: {
    'filestack-angular.min': path.resolve(__dirname, 'dist/filestack-angular/bundles/filestack-angular.umd.min.js'),
  },
  plugins: [
    new S3Plugin({
      basePath: `filestack-angular/` + version,
      directory: path.resolve(__dirname, 'dist/filestack-angular/bundles'),
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      s3UploadOptions: {
        Bucket: 'static.filestackapi.com'
      }
    })
  ]
}

module.exports = config;

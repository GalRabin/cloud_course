// Load external packages
var AWS = require('aws-sdk');
const express = require('express');
var jsrender = require('jsrender');
var uuid = require('uuid');

// constant
const bucketName = "ex1-q2-idc"
const port = 3000

// Express server init
const app = express()

// Create an S3 client
let s3 = new AWS.S3({signatureVersion: 'v4'});

// helper functions
function chunkArray(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
  }

  return tempArray;
}



// Main page handler
app.get('/', (req, res) => {
  var params = {
    Bucket: bucketName
  };
  let x  = s3.listObjects(params, function(err, data) {
    let urls = new Array();
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      // Get signed urls for all objects in S3 bucket
      for (const key in data.Contents) {
        var params = {
          Bucket: bucketName,
          Key: data.Contents[key].Key,
          Expires: 100
        };
        urls[urls.length] = s3.getSignedUrl('getObject', params);
      }
      // Split to chunks
      let urlsChunks = chunkArray(urls, 4);
      var imagesElements = ""
      for (const chunk in urlsChunks){
        imagesElements += `<div>\n`
        for (const url in urlsChunks[chunk]){
          imagesElements += `<img class="img-responsive" src="${urlsChunks[chunk][url]}" alt="">`
        }
        imagesElements += "</div>\n"
      }
      // Get upload singed url
      params = {
        Bucket: bucketName,
        Key:`${uuid.v4()}.png`,
        Expires: 3600
      }
      }
      let sigendUrlPutObject = new URL(s3.getSignedUrl('getObject', params));
      let sigendUrlPutObjectParams = sigendUrlPutObject.searchParams;
      console.log(sigendUrlPutObject);
      console.log(sigendUrlPutObjectParams);
      // Render html page
      generalHtmlParams = {
        images: imagesElements,
        action: sigendUrlPutObject,
        uniqKey: params.Key,
        protocol: sigendUrlPutObject.protocol,
        hostname: sigendUrlPutObject.hostname,
        xAmzCredential: sigendUrlPutObjectParams.get('X-Amz-Credential'),
        xAmAlgorithm: sigendUrlPutObjectParams.get('X-Amz-Algorithm'),
        xAmzDate: sigendUrlPutObjectParams.get('X-Amz-Date'),
        xAmzSignature: sigendUrlPutObjectParams.get('X-Amz-Signature'),
        xAmzExpires: sigendUrlPutObjectParams.get('X-Amz-Expires'),
        xAmzSignedHeaders: sigendUrlPutObjectParams.get('X-Amz-SignedHeaders')
      }
      var html = jsrender.renderFile(process.cwd() + '/myTemplate.html', generalHtmlParams);
      // Page response
      res.send(html);
    }  
  ).con;
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const crypto = require('crypto');

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// Tables name
var recordsTable = "Records";

exports.sensorPost = (sensor, plate) => {
    var time = Date.now();
    let hashPwd = crypto.createHash('sha1').update(plate + sensor + time).digest('hex'); 
    var params = {
        TableName: recordsTable,
        Item: {
            'RecordId': hashPwd,
            'LicensePlate': plate,
            'SensorId': sensor,
            'Time': time
        }
    }
    DynamoDB.put(params, function (err) {
            if (err) {
            console.log("Error", err);
        } else {
            console.log("Success");
        }
    });
}
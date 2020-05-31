// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const crypto = require('crypto');
const chalk = require('chalk');

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// Tables name
var recordsTable = "Records";

/** 
* Function which the sensors will import in order to populate new record.
* @param {Number} sensor - sensor ID.
* @param {String} plate - plate as xx-xxx-xx.
*/

exports.sensorPost = (sensor, plate) => {
    var time = Date.now();
    let hashPwd = crypto.createHash('sha1').update(plate + sensor + time).digest('hex'); 
    var params = {
        TableName: recordsTable,
        Item: {
            'RecordId': hashPwd,
            'LicensePlate': plate,
            'SensorId': sensor,
            'Occured': time
        }
    }
    DynamoDB.put(params, function (err) {
        if (err) {
            console.log(`Table ${params.TableName} - entry id ${hashPwd} - ` + chalk.red("Fail"));
        } else {
            console.log(`Table ${params.TableName} - entry id ${hashPwd} - ` + chalk.green("Success"));
        }
    });
}
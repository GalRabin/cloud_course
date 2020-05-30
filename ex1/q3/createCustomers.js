
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const uuid = require('uuid');
const camelCase = require('camelcase');
const randoms = require('./randoms');
// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// All plates
var allPlates = new Array();

function fillSensorsData(numberOfSensors, plates){
    for (let sensor = 1; sensor < numberOfSensors; sensor++) {
        var starIndex = randoms.getRandomInt(0, allPlates.length);
        var endIndex = randoms.getRandomInt(starIndex, allPlates.length);
        var params = {
            TableName: "SensorsList",
            Item: {
                'SensorId' : sensor,
                'Lat': `${randoms.getRandomInt(100000,999999)}.${randoms.getRandomInt(1,99)}`,
                'Lng': `${randoms.getRandomInt(100000,999999)}.${randoms.getRandomInt(1,99)}`,
                'Cost': randoms.getRandomInt(1,10),
                'MonthlyPlates': allPlates.slice(starIndex, endIndex)
            }
        }
        DynamoDB.put(params, function (err) {
                if (err) {
                console.log("Error", err);
            } else {
                console.log("Success");
            }
        });
    };
}

function fillCustomerData(numberOfCustomers){
    for (let customer = 1; customer < numberOfCustomers; customer++) {
        var customerName = randoms.generateName();
        var licensPlates = randoms.generateRandomPlates();
        allPlates = allPlates.concat(licensPlates);
        var custormerAddress = randoms.generateAddress();
        var params = {
            TableName: "CustomersList",
            Item: {
                'CustomerId' : customer,
                'Name': customerName,
                'BillingUrl': custormerAddress,
                'Email': `${camelCase(customerName)}@gmail.com`,
                'LicensPlate': licensPlates
            }
        }
        DynamoDB.put(params, function (err) {
                if (err) {
                console.log("Error", err);
            } else {
                console.log("Success");
            }
        });
    };
};


fillCustomerData(5);
fillSensorsData(5,allPlates);


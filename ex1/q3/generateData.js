
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const camelCase = require('camelcase');
const randoms = require('./randoms');
const crypto = require('crypto');
const postSensor = require('./sensorRecordPost')

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// Tables name
tables ={
    recordsTable: {
        tableName: "Records",
        tablePartitionKey: "RecordId"
    },
    customersTable: {
        tableName: "Customers",
        tablePartitionKey: "CustomerId"
    },
    sensorsTable: {
        tableName: "Sensors",
        tablePartitionKey: "SensorId"
    }
}

// Data size
var customersAmout = 30;
var sensorsAmount = 10;
var recordsAmount = 50;

// All plates
var allPlates = new Array();

async function createTables(){
    var AWS = require("aws-sdk");
    var dynamodb = new AWS.DynamoDB();
    
    for (const table in tables) {
        var params = {
            TableName : tables[table].tableName,
            KeySchema: [       
                { AttributeName: tables[table].tablePartitionKey, KeyType: "HASH"},
            ],
            AttributeDefinitions: [       
                { AttributeName: tables[table].tablePartitionKey, AttributeType: "S"},
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 1, 
                WriteCapacityUnits: 1
            }
        };

        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        }); 
    }
}

function fillCustomerData(numberOfCustomers){
    for (let customer = 1; customer < numberOfCustomers; customer++) {
        partitionKey = `${tables.sensorsTable.tablePartitionKey}`
        var customerName = randoms.generateName();
        var licensPlates = randoms.generateRandomPlates();
        allPlates = allPlates.concat(licensPlates);
        var params = {
            TableName: "Customers",
            Item: {
                "CustomerId" : customer.toString(),
                'Name': customerName,
                'BillingUrl': `www.${camelCase(customerName)}.com`,
                'Email': `${camelCase(customerName)}@gmail.com`,
                'LicensePlate': licensPlates
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

function fillSensorsData(numberOfSensors){
    for (let sensor = 1; sensor < numberOfSensors; sensor++) {
        partitionKey = `${tables.sensorsTable.tablePartitionKey}`
        var params = {
            TableName: "Sensors",
            Item: {
                'SensorId' : sensor.toString(),
                'Lat': `${randoms.getRandomInt(100000,999999)}.${randoms.getRandomInt(1,99)}`,
                'Lng': `${randoms.getRandomInt(100000,999999)}.${randoms.getRandomInt(1,99)}`,
                'Cost': randoms.getRandomInt(1,10),
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


function fillRecordsData(numberOfRecords){
    for (let record = 1; record < numberOfRecords; record++) {
        hash = crypto.getHashes();
        var plate = allPlates[randoms.getRandomInt(0, allPlates.length - 1)];
        var sensor = randoms.getRandomInt(1, sensorsAmount);
        postSensor.sensorPost(sensor, plate);
    };
}

// createTables();
fillCustomerData(customersAmout);
fillSensorsData(sensorsAmount);
fillRecordsData(recordsAmount);



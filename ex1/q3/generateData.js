/** 
* Run this script by the folowing usage - node <script_path> -f/-c
*/


// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const camelCase = require('camelcase');
const randoms = require('./randoms');
const crypto = require('crypto');
const postSensor = require('./sensorRecordPost');
const yargs = require('yargs');
const chalk = require('chalk');

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// Tables name and partition keys
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

/** 
* Create dynamoDB tables - Records, Customers, Sensors with right configuration.
* @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
*/
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
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };

        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.log(`Table creation - ${tables[table].tableName} - ` + chalk.red("Fail"));
            } else {
                console.log(`Table creation - ${tables[table].tableName} - ` + chalk.green("Success"));
            }
        }); 
    }
}

/** 
* Generate Cutomers entries in DynamoDB Customer tables.
* @param {Number} numberOfCustomers - Number of customers to create.
*/
async function fillCustomerData(numberOfCustomers){
    for (let customer = 1; customer < numberOfCustomers; customer++) {
        partitionKey = `${tables.sensorsTable.tablePartitionKey}`
        var customerName = randoms.generateName();
        var licensPlates = randoms.generateRandomPlates();
        allPlates = allPlates.concat(licensPlates);
        var params = {
            TableName: "Customers",
            // Customer data
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
                console.log(`Table ${params.TableName} - item id ${customer} - ` + chalk.red("Fail"));
            } else {
                console.log(`Table ${params.TableName} - item id ${customer} - ` + chalk.green("Success"));
            }
        });
    };
};


/** 
* Generate sensors enries in DynamoDB Sensors tables.
* @param {Number} numberOfSensors - Number of sensors to create.
*/
async function fillSensorsData(numberOfSensors){
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
                console.log(`Table ${params.TableName} - item id ${sensor} - ` + chalk.red("Fail"));
            } else {
                console.log(`Table ${params.TableName} - item id ${sensor} - ` + chalk.green("Success"));
            }
        });
    };
}


/** 
* Generate records entries in DynamoDB Records table.
* @param {Number} numberOfRecords - Number of records to create.
*/
async function fillRecordsData(numberOfRecords){
    for (let record = 1; record < numberOfRecords; record++) {
        hash = crypto.getHashes();
        var plate = allPlates[randoms.getRandomInt(0, allPlates.length - 1)];
        var sensor = randoms.getRandomInt(1, sensorsAmount);
        postSensor.sensorPost(sensor, plate);
    };
}

async function main() {
    const argv = yargs
    .option('create', {
        alias: 'c',
        description: 'Create tables - Customers, Sensors, Records',
        type: 'boolean',
    })
    .option('fill', {
        alias: 'f',
        description: 'Fill tables - Customers, Sensors, Records',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

    if (argv.create){
        createTables();
    } else if (argv.fill) {    
        console.log(
`
${chalk.blue("Summary")}:
1. Table customers: ${customersAmout} new items.
2. Table sensors: ${sensorsAmount} new items.
3. Table records: ${recordsAmount} new items.
`
        )
        await fillCustomerData(customersAmout);
        await fillSensorsData(sensorsAmount);
        await fillRecordsData(recordsAmount);
    } else {
        console.log("Please check usage with -h!")
    }
}

main();




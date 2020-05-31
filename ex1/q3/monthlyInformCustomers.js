// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// Tables name
var recordsTable = "Records";
var customersTable = "Customers";
var sensorsTable = "Sensors";


// Getting all customers
var params = {
    TableName : customersTable,
};

DynamoDB.scan(params, function(err, data) {
    if (err) console.log(err);
    else {
        data.Items.forEach(customer => processCustomer(customer));
    }
});

async function processCustomer(customer){
    let totalCost = 0;
    let monthSummary = { };
    for (const plate of customer.LicensePlate) {
        await getPlateSummary(plate, monthSummary)
    }
    for (const [sensorId, hits] of Object.entries(monthSummary)) {
        let data = await getSensorPrice(sensorId);
        totalCost += (hits * data.Item.Cost);
    }
    // postToUser(customer.BillingUrl, totalCost);
    printUserCost(customer, totalCost)
}

async function getPlateSummary(plate, monthSummary) {
    var params = {
        TableName : recordsTable,
        FilterExpression : 'LicensePlate = :plate and Time <= :time',
        ExpressionAttributeValues : {
            ':plate': plate,
            'time': Date.now() - 30
        }
    };
        
    return DynamoDB.scan(params, function(err, data) {
        if (err) console.log(err);
        else {
            data.Items.forEach(record => {
                if (monthSummary.hasOwnProperty(`${record.SensorId}`)) monthSummary[`${record.SensorId}`]++;
                else monthSummary[`${record.SensorId}`] = 1;
            })
        }
    }).promise();
}

async function getSensorPrice(sensorId) {
    var params = {
        TableName: sensorsTable,
        Key: {'SensorId': sensorId}
       };
       
    return DynamoDB.get(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        }
    }).promise();
}


async function getPlateSummary(plate, monthSummary) {
    var params = {
        TableName : 'Records',
        FilterExpression : 'LicensePlate = :plate',
        ExpressionAttributeValues : {':plate' : plate}
    };
        
    return DynamoDB.scan(params, function(err, data) {
        if (err) console.log(err);
        else {
            data.Items.forEach(record => {
                if (monthSummary.hasOwnProperty(`${record.SensorId}`)) monthSummary[`${record.SensorId}`]++;
                else monthSummary[`${record.SensorId}`] = 1;
            })
        }
    }).promise();
}

function postToUser(userBillUrl, totalCost){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", userBillUrl, true);
    xhr.send(`Cost = ${totalCost}`);

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
        }
    }
}

function printUserCost(customer, totalCost){
    console.log(
        `
        Customer: ${customer.Name}
        Email: ${customer.Email}
        Billing url: ${customer.BillingUrl}
        Cost: ${totalCost}
        `
    )
}
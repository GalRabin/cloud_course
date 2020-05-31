// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var moment = require('moment');

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB.DocumentClient();

// Tables name
var recordsTable = "Records";
var customersTable = "Customers";
var sensorsTable = "Sensors";

/** 
* Pocess each customer represent as Item:
*   1. Iterate over all plate cusotmer owns.
*       1.1 On each plate - we will scan occurence in records.
*       1.2 Summrize plate occurences by:  sensorID - plate occurences
*       1.3 Calculate cost - query sensor price * plate occurence in sensor.
*       1.4 Post bill to customer billing URL.
*       1.5 Log bill to console.
* @param {Object} customer - Customer object:
                                1. Name.
                                2. CustomerId.
                                3. Plates.
                                4. Email.
*/
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


/** 
* Check occurence of plate in records.
* @param {String} plate - Usally xx-xxx-xx.
* @param {object} monthSummary - Object as key(sensor)-value(plate amount of records)
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/
async function getPlateSummary(plate, monthSummary) {
    var params = {
        TableName : recordsTable,
        FilterExpression : 'LicensePlate = :plate',
        ExpressionAttributeValues : {
            ':plate': plate
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


/** 
* Query sensor cost by sensor ID.
* @param {String} sensorId - Sensor ID to query.
*/
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


/** 
* Post bill to billing URL specified in DynamoDB - customers table.
* @param {URL} userBillUrl- Url to sent the bill.
* @param {Number} userBillUrl- Total calculated cost.
*/
function postToUser(userBillUrl, totalCost){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", userBillUrl, true);
    xhr.send(`Cost = ${totalCost}`);

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(
`
Customer: ${customer.Name}
Email: ${customer.Email}
Billing url: ${customer.BillingUrl}
Cost: ${totalCost}
`
            )
        }
    }
}


/** 
* Log customer bill
* @param {URL} userBillUrl- Url to sent the bill.
* @param {Number} userBillUrl- Total calculated cost.
*/
function printUserCost(customer, totalCost){
    console.log(
`
Customer: ${customer.Name}
Email: ${customer.Email}
Billing url: ${customer.BillingUrl}
Plates: ${customer.LicensePlate}
Cost: ${totalCost}
`
    )
    console.log("=".repeat(40))
}


function main(){
    var params = {
        TableName : customersTable,
    };
    
    DynamoDB.scan(params, function(err, data) {
        if (err) console.log(err);
        else {
            data.Items.forEach(customer => processCustomer(customer));
        }
    });
}

main()
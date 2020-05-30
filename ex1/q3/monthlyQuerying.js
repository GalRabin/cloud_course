// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var dynamodb = new AWS.DynamoDB();

// Global number of customers
customersSize = 5

for (let customer = 1; customer < 5; customer++) {
    // Getting customer details
    var params = {
        Key: {
            "CustomerId": {
            N: customer.toString()
            }
        }, 
        TableName: "CustomersList"
    };
    dynamodb.getItem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            data.LicensPlate.forEach

            var params = {
                TableName : 'SensorsList',
                FilterExpression: "contains (LicensPlate, :category1)",
                ExpressionAttributeValues : {   
                    ':category1' : "33-423-10",
                }
            };
              
            
            documentClient.scan(params, function(err, data) {
                if (err) console.log(err);
                else console.log(data);
            });
        }
    });


}



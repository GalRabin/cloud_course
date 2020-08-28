from typing import Optional

import boto3
from botocore.exceptions import ClientError

from src.utils.responses import ServerResponseDynamo

dynamodb = boto3.resource('dynamodb')


def create_table(table_name):
    return dynamodb.Table(table_name)


def dynamo_db_create_table(table_name: str):
    response = ServerResponseDynamo(operation="Creating Table")
    try:
        dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'uuid',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'uuid',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        )
    except ClientError:
        response.additionl_info = f"Table {table_name} allready exists"
        response.set_fail()

    return response


def put_dynamo_db(table_name: str, item: dict):
    response = ServerResponseDynamo(f"Update item with uuid '{item.get('uuid')}' in table '{table_name}'")
    response.additionl_info = item
    try:
        create_table(table_name).put_item(
            Item=item
        )
    except ClientError:
        response.set_fail()

    return response


def get_dynamo_db(table_name: str, uuid: str) -> dict:
    response = None
    try:
        response = create_table(table_name).get_item(Key=uuid)
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        try:
            response: Optional[dict] = response["Item"]
        except KeyError:
            raise

    return response


def delete_dynamo_db(table_name: str, uuid: str):
    response = ServerResponseDynamo(f"Delete item with uuid '{uuid}' in table '{table_name}'")

    try:
        create_table(table_name).delete_item(Key={'uuid': uuid})
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            response.set_fail()
        else:
            raise
    else:
        return response


def list_dynamo_db(table):
    try:
        response = create_table(table).scan()
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            print(e.response['Error']['Message'])
        else:
            raise
    else:
        return response['Items']

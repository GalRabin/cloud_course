from __future__ import annotations
from typing import Optional, List

from paramiko import SSHClient, BadHostKeyException, SSHException, AutoAddPolicy

from src.utils.dynamo import get_dynamo_db, delete_dynamo_db, dynamo_db_create_table, put_dynamo_db, list_dynamo_db
from src.utils.errors import UserValidationError
from src.utils.responses import ServerResponseDynamo

TABLE_NAME = "Users"


class User:
    def __init__(self, uuid: str, hostname: str, username: str, password: str):
        self.uuid = uuid
        self.username = username
        self.password = password
        self.hostname = hostname

    def validate_ssh_connection(self):
        client = SSHClient()
        client.set_missing_host_key_policy(AutoAddPolicy())
        try:
            client.connect(hostname=self.hostname,
                           username=self.username,
                           password=self.password)
        except (SSHException, BadHostKeyException, BadHostKeyException) as e:
            raise UserValidationError(self, e)
        finally:
            client.close()

    def to_dict(self):
        return {
            'uuid': self.uuid,
            'hostname': self.hostname,
            'username': self.username,
            'password': self.password,
        }

    @staticmethod
    def create_table() -> ServerResponseDynamo:
        return dynamo_db_create_table(TABLE_NAME)

    def put(self) -> ServerResponseDynamo:
        return put_dynamo_db(table_name=TABLE_NAME,
                             item=self.to_dict())

    @classmethod
    def get(cls, uuid: str) -> Optional[User]:
        user = None
        json_user = get_dynamo_db(TABLE_NAME, {"uuid": uuid})
        if json_user:
            user = User(**json_user)

        return user

    @classmethod
    def delete(cls, uuid: str) -> ServerResponseDynamo:
        return delete_dynamo_db(TABLE_NAME, uuid)

    @classmethod
    def list(cls) -> List[Optional[User]]:
        return [User(**user) for user in list_dynamo_db(TABLE_NAME)]

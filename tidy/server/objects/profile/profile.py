from __future__ import annotations

from typing import Optional, List

from .sub_modules.golang import GoLang
from .sub_modules.python import Python
from utils.dynamo import get_dynamo_db, delete_dynamo_db, dynamo_db_create_table, put_dynamo_db, list_dynamo_db
from utils.responses import ServerResponseDynamo

TABLE_NAME = "Profiles"


class Profile:
    def __init__(self, uuid: str, python: dict, golang: dict):
        self.uuid = uuid
        self.python = Python(**python)
        self.golang = GoLang(**golang)

    def to_dict(self, list_versions=False):
        if list_versions:
            response = {
                'uuid': self.uuid,
                'python': self.python.make_list(),
                'golang': self.golang.make_list(),
            }
        else:
            response = {
                'uuid': self.uuid,
                'python': self.python.__dict__,
                'golang': self.golang.__dict__
            }

        return response

    @staticmethod
    def create_table() -> ServerResponseDynamo:
        return dynamo_db_create_table(TABLE_NAME)

    def put(self) -> ServerResponseDynamo:
        return put_dynamo_db(table_name=TABLE_NAME,
                             item=self.to_dict())

    @classmethod
    def get(cls, uuid: str) -> Optional[Profile]:
        profile = None
        json_profile = get_dynamo_db(TABLE_NAME, {"uuid": uuid})
        if json_profile:
            profile = Profile(**json_profile)

        return profile

    @classmethod
    def delete(cls, uuid: str) -> ServerResponseDynamo:
        return delete_dynamo_db(TABLE_NAME, uuid)

    @classmethod
    def list(cls) -> List[Optional[Profile]]:
        return [Profile(**profile) for profile in list_dynamo_db(TABLE_NAME)]

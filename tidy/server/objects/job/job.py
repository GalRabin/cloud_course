from __future__ import annotations

from typing import Optional, List

from objects.profile.profile import Profile
from objects.user.user import User
from utils.dynamo import get_dynamo_db, delete_dynamo_db, dynamo_db_create_table, put_dynamo_db, list_dynamo_db
from utils.responses import ServerResponseDynamo

TABLE_NAME = "Jobs"


class JobStatus:
    idle = "idle"
    running = "Running"
    finished = "Finished"


class Job:
    def __init__(self, uuid: str, user_uuid: str, profile_uuid: str, state: JobStatus = JobStatus.idle):
        self.uuid = uuid
        self.profile = Profile.get(profile_uuid)
        self.user = User.get(user_uuid)
        self.state = state

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "user_uuid": self.user.uuid,
            "profile_uuid": self.profile.uuid
        }

    @staticmethod
    def create_table() -> ServerResponseDynamo:
        return dynamo_db_create_table(TABLE_NAME)

    def put(self) -> ServerResponseDynamo:
        return put_dynamo_db(table_name=TABLE_NAME,
                             item=self.to_dict())

    @classmethod
    def get(cls, uuid: str) -> Optional[Job]:
        job = None
        json_job = get_dynamo_db(TABLE_NAME, {"uuid": uuid})
        if json_job:
            job = Job(**json_job)

        return job

    @classmethod
    def delete(cls, uuid: str) -> ServerResponseDynamo:
        return delete_dynamo_db(TABLE_NAME, uuid)

    @classmethod
    def list(cls) -> List[Optional[Job]]:
        return [Job(**job) for job in list_dynamo_db(TABLE_NAME)]

from dataclasses import dataclass

from ansible_runner import Runner

from objects.job.job import Job
from utils.responses import ServerResponse


@dataclass
class ServerResponseJobManager(ServerResponse):
    job: Job
    runner: Runner

    def is_fail(self) -> bool:
        return self.runner.status == "fail"

    def to_dict(self):
        return {
            "job": self.job.to_dict(),
            "stdout": self.runner.stdout.readlines(),
            "status": self.runner.status
        }

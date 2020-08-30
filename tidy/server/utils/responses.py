from __future__ import annotations

from abc import abstractmethod
from dataclasses import dataclass
from typing import Optional, Any


class DynamoStatus:
    success = "success"
    fail = "fail"


class ServerResponse:
    @abstractmethod
    def is_fail(self) -> bool:
        pass

    @abstractmethod
    def to_dict(self):
        pass


@dataclass
class ServerResponseDynamo(ServerResponse):
    operation: str
    additionl_info: Optional[Any] = None
    status = DynamoStatus.success

    def set_fail(self):
        self.status = DynamoStatus.fail

    def is_fail(self) -> bool:
        return self.status == DynamoStatus.fail

    def to_dict(self):
        return {
            "operation": self.operation,
            "additionl_info": self.additionl_info,
            "status": self.status
        }

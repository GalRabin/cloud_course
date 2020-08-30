from typing import Dict

import ansible_runner
from ansible_runner import Runner, RunnerConfig

from objects.job.job import Job
from objects.jobs_manager.response import ServerResponseJobManager
from utils.common import get_src_root

import logging

logger = logging.getLogger(__name__)
class JobManager:
    jobs: Dict[str, Runner] = {}

    @staticmethod
    def _execute(job: Job):
        thread, runner = ansible_runner.run_async(private_data_dir=str(get_src_root() / 'ansible'),
                                                  ident=f"{job.profile.uuid}-{job.user.uuid}",
                                                  playbook='playbook.yml',
                                                  roles_path='roles',
                                                  inventory=f"{job.user.uuid} ansible_host={job.user.hostname} "
                                                            f"ansible_user={job.user.username} ansible_password={job.user.password}",
                                                  verbosity=2,
                                                  extravars=job.profile.to_dict(True))
        logger.info(get_src_root() / 'ansible')

        return thread, runner

    @classmethod
    def execute_job(cls, uuid: str):
        job = Job.get(uuid)
        thread, runner = cls._execute(job)
        cls.jobs[uuid] = runner

        return ServerResponseJobManager(job, runner)

    @classmethod
    def job_status(cls, uuid: str):
        job = Job.get(uuid)
        config = RunnerConfig(private_data_dir=str(get_src_root() / 'ansible'),
                              ident=f"{job.profile.uuid}-{job.user.uuid}",
                              playbook='playbook.yml',
                              roles_path='roles',
                              inventory=f"{job.user.uuid} ansible_host={job.user.hostname} "
                                        f"ansible_user={job.user.username} ansible_password={job.user.password}",
                              verbosity=2,
                              extravars=job.profile.to_dict(True))
        runner = Runner(config)

        return ServerResponseJobManager(job, runner)

from db.models.ModelSelectionJobs import ModelSelectionJob
from utils.exceptions import ModelSelectionJobNotFound


class ModelSelectionJobService:
    def __init__(self) -> None:
        pass

    def find_by_id(self, id, user_id) -> ModelSelectionJob:
        jobs = ModelSelectionJob.objects(created_by=user_id, id=id)
        if len(jobs) == 0:
            raise ModelSelectionJobNotFound
        return jobs[0]

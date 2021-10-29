import docker
from docker.client import DockerClient
from lib.export_integrations.exporter import Exporter
import tempfile
import shutil
import os


class DockerExporter(Exporter):
    def __init__(self) -> None:
        super().__init__()
        self.docker_client: DockerClient = docker.from_env()

    def export(self, model_location, **kwargs):
        temp_dir = tempfile.TemporaryDirectory()
        temp_dir_location = temp_dir.name
        shutil.copyfile(
            "./docker/Dockerfile", os.path.join(temp_dir_location, "Dockerfile")
        )
        shutil.copytree(model_location, os.path.join(temp_dir_location, "model"))
        model_name = kwargs.get("model_name") or "model"
        model_version = kwargs.get("model_version") or 1
        build_args = {
            "MODEL_PATH": "model",
            "MODEL_NAME": model_name,
            "MODEL_VERSION": str(model_version),
        }
        print(build_args)
        tag = f"{model_name}-v{model_version}:latest"
        image, logs = self.docker_client.images.build(
            path=temp_dir_location, tag=tag, buildargs=build_args
        )

        file_path = f"docker/{image.id}_{build_args['MODEL_NAME']}.tar"
        f = open(file_path, "wb")
        for chunk in image.save():
            f.write(chunk)
        f.close()
        return file_path

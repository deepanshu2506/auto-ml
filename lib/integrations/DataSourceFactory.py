from lib.integrations.MysqlIntegration import MySqlIntegration
from lib.integrations.integration import Integration


class DatasourceFactory:
    integrations_map = {"mysql": MySqlIntegration}

    @staticmethod
    def get_datasource(type: str, **kwargs) -> Integration:
        integration_cls = DatasourceFactory.integrations_map.get(type)
        return integration_cls(**kwargs)

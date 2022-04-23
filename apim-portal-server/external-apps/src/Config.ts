import { ApsConfigService, APSConnector } from "@solace-iot-team/apim-server-openapi-node";
import AsApsOpenApiClientConfig from "../as-lib/AsApsOpenApiClientConfig";
import AsConnectorOpenApiClientConfig from "../as-lib/AsConnectorOpenApiClientConfig";
import AsEnv from "../as-lib/AsEnv";

enum EEnvVars {
  ORGANIZATION_ID = "ORGANIZATION_ID",
}

class Config {
  private readonly envVarPrefix = "APSS_EXTERNAL_APPS";
  private organizationId: string;

  private create_envVarName(apssEnvVars: EEnvVars) {
    return `${this.envVarPrefix}_${apssEnvVars}`;
  }
  
  public initialize = async() => {
    const funcName = 'initialize';
    const logName = `${Config.name}.${funcName}()`;

    AsApsOpenApiClientConfig.initialize();
    // get the active connector config
    const apsConnector: APSConnector = await ApsConfigService.getActiveApsConnector();

    AsConnectorOpenApiClientConfig.initialize({ apsConnectorClientConfig: apsConnector.connectorClientConfig });

    this.organizationId = AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVars.ORGANIZATION_ID));

  }

  public getOrganizationId() { return this.organizationId; }

}

export default new Config();




import { APSConnectorClientConfig } from "@solace-iot-team/apim-server-openapi-node";
import AsConnectorOpenApiClient from "./AsConnectorOpenApiClient";

enum EEnvVarsConnectorOpenApiClient {
  HOST = "HOST",
  PORT = "PORT",
  PROTOCOL = "PROTOCOL",
  USER = "USER",
  PWD = "PWD",
}
class AsConnectorOpenApiClientConfig {
  private readonly envVarPrefix = "APSS_CONNECTOR_CLIENT_CONNECTION";
  // private asApsOpenApiClientConfig: TASApsOpenApiConfig;
  
  private create_envVarName(apssEnvVars: EEnvVarsConnectorOpenApiClient) {
    return `${this.envVarPrefix}_${apssEnvVars}`;
  }
  
  public initialize({ apsConnectorClientConfig }:{
    apsConnectorClientConfig: APSConnectorClientConfig;
  }): void {
    const funcName = 'initialize';
    const logName = `${AsConnectorOpenApiClientConfig.name}.${funcName}()`;

    AsConnectorOpenApiClient.initialize({ apsConnectorClientConfig: apsConnectorClientConfig });

  }
}

export default new AsConnectorOpenApiClientConfig();




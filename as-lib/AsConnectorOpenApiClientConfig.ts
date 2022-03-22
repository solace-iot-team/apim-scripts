import AsApsOpenApiClient, { TASApsOpenApiConfig } from "../as-lib/AsApsOpenApiClient";
import AsEnv from "../as-lib/AsEnv";

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
  
  public initialize() {
    const funcName = 'initialize';
    const logName = `${AsConnectorOpenApiClientConfig.name}.${funcName}()`;

    const asApsOpenApiConfig: TASApsOpenApiConfig = {
      host: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsConnectorOpenApiClient.HOST)),
      port: AsEnv.getMandatoryEnvVarValueAsNumber(this.create_envVarName(EEnvVarsConnectorOpenApiClient.PORT)),
      protocol: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsConnectorOpenApiClient.PROTOCOL)),
      user: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsConnectorOpenApiClient.USER)),
      pwd: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsConnectorOpenApiClient.PWD)),
    };
    // this.asApsOpenApiClientConfig = asApsOpenApiConfig;
    AsApsOpenApiClient.initialize({
      asApsOpenApiConfig: asApsOpenApiConfig
    });
  }
}

export default new AsConnectorOpenApiClientConfig();




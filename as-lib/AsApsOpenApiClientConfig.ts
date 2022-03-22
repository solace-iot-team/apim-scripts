import AsApsOpenApiClient, { TASApsOpenApiConfig } from "../as-lib/AsApsOpenApiClient";
import AsEnv from "../as-lib/AsEnv";

enum EEnvVarsApsOpenApiClient {
  HOST = "HOST",
  PORT = "PORT",
  PROTOCOL = "PROTOCOL",
  USER = "USER",
  PWD = "PWD",
}
class AsApsOpenApiClientConfig {
  private readonly envVarPrefix = "APSS_APS_CLIENT_CONNECTION";
  // private asApsOpenApiClientConfig: TASApsOpenApiConfig;
  
  private create_envVarName(apssEnvVars: EEnvVarsApsOpenApiClient) {
    return `${this.envVarPrefix}_${apssEnvVars}`;
  }
  
  public initialize() {
    const funcName = 'initialize';
    const logName = `${AsApsOpenApiClientConfig.name}.${funcName}()`;

    const asApsOpenApiConfig: TASApsOpenApiConfig = {
      host: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsApsOpenApiClient.HOST)),
      port: AsEnv.getMandatoryEnvVarValueAsNumber(this.create_envVarName(EEnvVarsApsOpenApiClient.PORT)),
      protocol: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsApsOpenApiClient.PROTOCOL)),
      user: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsApsOpenApiClient.USER)),
      pwd: AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVarsApsOpenApiClient.PWD)),
    };
    // this.asApsOpenApiClientConfig = asApsOpenApiConfig;
    AsApsOpenApiClient.initialize({
      asApsOpenApiConfig: asApsOpenApiConfig
    });
  }
}

export default new AsApsOpenApiClientConfig();




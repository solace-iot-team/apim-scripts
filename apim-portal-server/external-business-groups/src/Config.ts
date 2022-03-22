import AsApsOpenApiClient, { TASApsOpenApiConfig } from "../as-lib/AsApsOpenApiClient";
import AsConnectorOpenApiClient, { TASConnectorOpenApiClientConfig } from "../as-lib/AsConnectorOpenApiClient";
import AsEnv from "../as-lib/AsEnv";

enum EEnvVars {
  ORGANIZATION_ID = "ORGANIZATION_ID",
  EXTERNAL_SYSTEM_ID = "EXTERNAL_SYSTEM_ID",
  BUSINESS_GROUPS_IMPORT_FILE = "BUSINESS_GROUPS_IMPORT_FILE",
}

class Config {
  private readonly ComponentName = "ApssConfig";
  private readonly envVarPrefix = "APSS_EXTERNAL_BUSINESS_GROUPS";
  private organizationId: string;
  private externalSystemId: string;
  private businessGroupImportFilePath: string;
  private asConnectorOpenClientApiConfig: TASConnectorOpenApiClientConfig;

  private create_envVarName(apssEnvVars: EEnvVars) {
    return `${this.envVarPrefix}_${apssEnvVars}`;
  }
  
  private initialize_AsApsOpenApiClient(): TASApsOpenApiConfig {
    // TODO: read these values from env
    const asApsOpenApiConfig: TASApsOpenApiConfig = {
      host: 'localhost',
      port: 3003,
      protocol: 'http',
      user: 'service-account-user',
      pwd: 'very-secret'
    };
    return asApsOpenApiConfig;
  }

  private initialize_AsConnectorOpenApiClient(): TASConnectorOpenApiClientConfig {
    // TODO: read these values from env
    const asConnectorApiClientConfig: TASConnectorOpenApiClientConfig = {
      host: 'localhost',
      port: 3003,
      protocol: 'http',
      user: 'service-account-user',
      pwd: 'very-secret'
    };
    return asConnectorApiClientConfig;
  }

  public initialize() {
    const funcName = 'initialize';
    const logName = `${Config.name}.${funcName}()`;

    AsApsOpenApiClient.initialize({
      asApsOpenApiConfig: this.initialize_AsApsOpenApiClient()
    });

    AsConnectorOpenApiClient.initialize({
      asConnectorApiClientConfig: this.initialize_AsConnectorOpenApiClient()
    });

    this.organizationId = AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVars.ORGANIZATION_ID));
    this.externalSystemId = AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVars.EXTERNAL_SYSTEM_ID));
    this.businessGroupImportFilePath = AsEnv.getMandatoryEnvVarValueAsFilePathWithReadPermissions(this.create_envVarName(EEnvVars.BUSINESS_GROUPS_IMPORT_FILE));

  }

  public getOrganizationId() { return this.organizationId; }
  public getExternalSystemId() { return this.externalSystemId; }
  public getBusinessGroupImportFilePath() { return this.businessGroupImportFilePath; }

}

export default new Config();




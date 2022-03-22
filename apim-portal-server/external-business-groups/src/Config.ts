import AsApsOpenApiClientConfig from "../as-lib/AsApsOpenApiClientConfig";
import AsEnv from "../as-lib/AsEnv";

enum EEnvVars {
  ORGANIZATION_ID = "ORGANIZATION_ID",
  EXTERNAL_SYSTEM_ID = "EXTERNAL_SYSTEM_ID",
  BUSINESS_GROUPS_IMPORT_FILE = "BUSINESS_GROUPS_IMPORT_FILE",
}

class Config {
  private readonly envVarPrefix = "APSS_EXTERNAL_BUSINESS_GROUPS";
  private organizationId: string;
  private externalSystemId: string;
  private businessGroupImportFilePath: string;

  private create_envVarName(apssEnvVars: EEnvVars) {
    return `${this.envVarPrefix}_${apssEnvVars}`;
  }
  
  public initialize() {
    const funcName = 'initialize';
    const logName = `${Config.name}.${funcName}()`;

    AsApsOpenApiClientConfig.initialize();

    this.organizationId = AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVars.ORGANIZATION_ID));
    this.externalSystemId = AsEnv.getMandatoryEnvVarValueAsString(this.create_envVarName(EEnvVars.EXTERNAL_SYSTEM_ID));
    this.businessGroupImportFilePath = AsEnv.getMandatoryEnvVarValueAsFilePathWithReadPermissions(this.create_envVarName(EEnvVars.BUSINESS_GROUPS_IMPORT_FILE));

  }

  public getOrganizationId() { return this.organizationId; }
  public getExternalSystemId() { return this.externalSystemId; }
  public getBusinessGroupImportFilePath() { return this.businessGroupImportFilePath; }

}

export default new Config();




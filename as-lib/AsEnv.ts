
import AsUtils from './AsUtils';


class AsEnv {

  public getMandatoryEnvVarValueAsString = (envVarName: string): string => {
    const funcName = 'getMandatoryEnvVarValue';
    const logName = `${AsEnv.name}.${funcName}()`;
    const value: any = (process.env[envVarName] === undefined) ? null : process.env[envVarName];
    if (value == null) throw new Error(`${logName}: ERROR: missing env var: ${envVarName}`);
    return value;
  }
  
  public getMandatoryEnvVarValueAsNumber = (envVarName: string): number => {
    const funcName = 'getMandatoryEnvVarValueAsNumber';
    const logName = `${AsEnv.name}.${funcName}()`;
    const value: string = this.getMandatoryEnvVarValueAsString(envVarName);
    const valueAsNumber: number = parseInt(value);
    if (Number.isNaN(valueAsNumber)) throw new Error(`${logName}: ERROR: env var type is not a number: ${envVarName}=${value}`);
    // throw new ConfigEnvVarNotANumberServerError(logName, 'env var type is not a number', envVarName, value);
    return valueAsNumber;
  };

  public getMandatoryEnvVarValueAsFilePathWithReadPermissions = (envVarName: string): string => {
    const funcName = 'getMandatoryEnvVarValueAsFilePathWithReadPermissions';
    const logName = `${AsEnv.name}.${funcName}()`;
    const value: string = this.getMandatoryEnvVarValueAsString(envVarName);
    const absoluteFilePath: string | undefined = AsUtils.validateFilePathHasReadPermission(value);
    if(absoluteFilePath === undefined) {
      throw new Error(`${logName}: file path: ${value} cannot be found or does not have read permissions.`);
    }
    return absoluteFilePath;
  }


}

export default new AsEnv();
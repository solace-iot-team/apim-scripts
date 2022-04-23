
import { OpenAPI } from '@solace-iot-team/apim-connector-openapi-node';
import { APSConnectorClientConfig, APSLocationConfigExternal, APSLocationConfigInternalProxy } from '@solace-iot-team/apim-server-openapi-node';
import AsUtils from './AsUtils';


class AsConnectorOpenApiClient {    

  private createBaseUrl = (platformProtocol: string, platformHost: string, platformPort: number): string => {
    return `${platformProtocol}://${platformHost}:${platformPort}/v1`;
  }
  
  public initialize = ({ apsConnectorClientConfig }:{
    apsConnectorClientConfig: APSConnectorClientConfig;
  }) => {
    const funcName = 'initialize';
    const logName = `${AsConnectorOpenApiClient.name}.${funcName}()`;

    const configType: APSLocationConfigExternal.configType | APSLocationConfigInternalProxy.configType = apsConnectorClientConfig.locationConfig.configType;
    switch(configType) {
      case APSLocationConfigExternal.configType.EXTERNAL:
        const externalLocationConfig: APSLocationConfigExternal = apsConnectorClientConfig.locationConfig as APSLocationConfigExternal;
        OpenAPI.BASE = this.createBaseUrl(externalLocationConfig.protocol, externalLocationConfig.host, externalLocationConfig.port);
        break;
      case APSLocationConfigInternalProxy.configType.INTERNAL_PROXY:
        throw new Error(`${logName}: APSLocationConfigInternalProxy config not supported, requires an external config`);
        break;
      default:
        AsUtils.assertNever(logName, configType);
    }
    OpenAPI.USERNAME = apsConnectorClientConfig.serviceUser;
    OpenAPI.PASSWORD = apsConnectorClientConfig.serviceUserPwd;
  }

}

export default new AsConnectorOpenApiClient();

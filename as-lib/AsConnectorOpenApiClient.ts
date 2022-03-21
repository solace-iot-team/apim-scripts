
import { OpenAPI } from '@solace-iot-team/apim-connector-openapi-node';

export type TASConnectorOpenApiClientConfig = {
  protocol: string;
  host: string;
  port: number;
  user: string;
  pwd: string;
};

class AsConnectorOpenApiClient {    
  private asConnectorOpenApiClientConfig: TASConnectorOpenApiClientConfig;

  private createBaseUrl = (platformProtocol: string, platformHost: string, platformPort: number): string => {
    return `${platformProtocol}://${platformHost}:${platformPort}/v1`;
  }
  
  public initialize({ asConnectorApiClientConfig }:{
    asConnectorApiClientConfig: TASConnectorOpenApiClientConfig;
  }) {
    this.asConnectorOpenApiClientConfig = JSON.parse(JSON.stringify(asConnectorApiClientConfig));
    OpenAPI.BASE = this.createBaseUrl(asConnectorApiClientConfig.protocol, asConnectorApiClientConfig.host, asConnectorApiClientConfig.port);
    OpenAPI.USERNAME = asConnectorApiClientConfig.user;
    OpenAPI.PASSWORD = asConnectorApiClientConfig.pwd;
  }
}

export default new AsConnectorOpenApiClient();

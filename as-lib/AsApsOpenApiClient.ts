import { OpenAPI } from "@solace-iot-team/apim-server-openapi-node";

export type TASApsOpenApiConfig = {
  protocol: string;
  host: string;
  port: number;
  user: string;
  pwd: string;
};

class AsApsOpenApiClient {
  private asApsOpenApiConfig: TASApsOpenApiConfig;

  private createBaseUrl = (protocol: string, host: string, port: number): string => {
    // const base: URL = new URL(APSOpenAPI.BASE, APSClientOpenApi.config.apsServerUrl.toString());
    // APSOpenAPI.BASE = base.toString();
    return `${protocol}://${host}:${port}/apim-server/v1`;
  }

  public initialize({ asApsOpenApiConfig }:{
    asApsOpenApiConfig: TASApsOpenApiConfig;
  }) {
    this.asApsOpenApiConfig = JSON.parse(JSON.stringify(asApsOpenApiConfig));
    OpenAPI.BASE = this.createBaseUrl(asApsOpenApiConfig.protocol, asApsOpenApiConfig.host, asApsOpenApiConfig.port);
    // OpenAPI.USERNAME = asApsOpenApiConfig.user;
    // OpenAPI.PASSWORD = asApsOpenApiConfig.pwd;  
  }


}

export default new AsApsOpenApiClient();

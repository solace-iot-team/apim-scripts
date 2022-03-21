
import { 
  ApiError, 
  ApsAdministrationService, 
  APSExternalSystemList, 
  ApsExternalSystemsService, 
  APSOrganizationList, 
  ListAPSExternalSystemsResponse, 
  ListAPSOrganizationResponse
} from "@solace-iot-team/apim-server-openapi-node";

class AsExternalSystemService {

  /**
   * Checks if APS external system exist.
  */
  public async exists({ organizationId, externalSystemId }:{
    organizationId: string;
    externalSystemId: string;
  }): Promise<boolean> {
    const funcName = 'exists';
    const logName = `${AsExternalSystemService.name}.${funcName}()`;

    try {
      await ApsExternalSystemsService.getApsExternalSystem({
        organizationId: organizationId,
        externalSystemId: externalSystemId
      });
    } catch (e: any) {
      if(e instanceof ApiError) {
        const apiError: ApiError = e;
        if(apiError.status === 404) return false;
        console.log(`${logName}: ERROR: ${JSON.stringify(apiError)}`);
        throw e;
      }
      throw e;
    }
    return true;
  }

  public async list({ organizationId }:{
    organizationId: string;
  }): Promise<APSExternalSystemList> {
    const funcName = 'list';
    const logName = `${AsExternalSystemService.name}.${funcName}()`;

    const listResponse: ListAPSExternalSystemsResponse = await ApsExternalSystemsService.listApsExternalSystems({
      organizationId: organizationId
    });
    return listResponse.list;
  }

}

export default new AsExternalSystemService();




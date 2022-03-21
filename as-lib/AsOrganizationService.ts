
import { 
  ApiError, 
  ApsAdministrationService, 
  APSOrganizationList, 
  ListAPSOrganizationResponse
} from "@solace-iot-team/apim-server-openapi-node";

class AsOrganizationService {

  /**
   * Checks if all organzation exist.
   */
  public async exists({ organizationId }:{
    organizationId: string;
  }): Promise<boolean> {
    const funcName = 'exists';
    const logName = `${AsOrganizationService.name}.${funcName}()`;

    console.log(`${logName}: check organization exists: ${organizationId}`);
    // make the calls to connector and aps
    return false;
  }

  /**
   * Checks if  connector organzation exist.
   */
  public async connectorExists({ organizationId }:{
    organizationId: string;
  }): Promise<boolean> {
    const funcName = 'connectorExists';
    const logName = `${AsOrganizationService.name}.${funcName}()`;

    console.log(`${logName}: check connector organization exists: ${organizationId}`);
    // make the calls to connector
    return false;
  }

  /**
   * Checks if APS organzation exist.
  */
  public async apsExists({ organizationId }:{
    organizationId: string;
  }): Promise<boolean> {
    const funcName = 'apsExists';
    const logName = `${AsOrganizationService.name}.${funcName}()`;

    try {
      await ApsAdministrationService.getApsOrganization({
        organizationId: organizationId
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

  public async listApsOrganizations(): Promise<APSOrganizationList> {
    const funcName = 'listApsOrganizations';
    const logName = `${AsOrganizationService.name}.${funcName}()`;

    const listResponse: ListAPSOrganizationResponse = await ApsAdministrationService.listApsOrganizations();
    return listResponse.list;
  }

}

export default new AsOrganizationService();




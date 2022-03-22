
import { 
  ApiError, 
  APSBusinessGroupCreate, 
  APSBusinessGroupResponse, 
  ApsBusinessGroupsService,
  APSBusinessGroupUpdate, 
} from "@solace-iot-team/apim-server-openapi-node";
import { WithRequired } from "./AsUtils";

export type TASExternalBusinessGroup = WithRequired<APSBusinessGroupCreate, 'externalReference'>;

export type TASExternalBusinessGroupTreeNode = {
  exists: boolean;
  externalBusinessGroup: TASExternalBusinessGroup;
  children: TASExternalBusinessGroupTreeNodeList;
};

export type TASExternalBusinessGroupTreeNodeList = Array<TASExternalBusinessGroupTreeNode>;

class AsBusinessGroupsService {

    /**
   * Checks if APS external business group exists in organization by external id.
   * @returns internal business group id or undefined if not exists
  */
  public async get_BusinessGroupId_By_ExternalBusinessGroupId({ organizationId, externalBusinessGroupId }:{
    organizationId: string;
    externalBusinessGroupId: string;
  }): Promise<string | undefined> {
    const funcName = 'get_BusinessGroupId_By_ExternalBusinessGroupId';
    const logName = `${AsBusinessGroupsService.name}.${funcName}()`;

    try {
      const apsBusinessGroupResponse: APSBusinessGroupResponse = await ApsBusinessGroupsService.getApsBusinessGroupByExternalReference({
        organizationId: organizationId,
        externalReferenceId: externalBusinessGroupId
      });
      return apsBusinessGroupResponse.businessGroupId;
    } catch (e: any) {
      if(e instanceof ApiError) {
        const apiError: ApiError = e;
        if(apiError.status === 404) return undefined;
        console.log(`${logName}: ERROR: ${JSON.stringify(apiError)}`);
        throw e;
      }
      throw e;
    }
  }
  
  /**
   * Checks if APS external business group exists in organization.
  */
  public async exists_ExternalBusinessGroup({ organizationId, externalBusinessGroupId }:{
    organizationId: string;
    externalBusinessGroupId: string;
  }): Promise<boolean> {
    const funcName = 'exists_ExternalBusinessGroup';
    const logName = `${AsBusinessGroupsService.name}.${funcName}()`;

    try {
      const apsBusinessGroupResponse: APSBusinessGroupResponse = await ApsBusinessGroupsService.getApsBusinessGroupByExternalReference({
        organizationId: organizationId,
        externalReferenceId: externalBusinessGroupId
      });
      return true;
    } catch (e: any) {
      if(e instanceof ApiError) {
        const apiError: ApiError = e;
        if(apiError.status === 404) return false;
        console.log(`${logName}: ERROR: ${JSON.stringify(apiError)}`);
        throw e;
      }
      throw e;
    }
  }

  public async create_ExternalBusinessGroup({ organizationId, asExternalBusinessGroup }: {
    organizationId: string;
    asExternalBusinessGroup: TASExternalBusinessGroup;
  }): Promise<void> {

    await ApsBusinessGroupsService.createApsBusinessGroup({
      organizationId: organizationId,
      requestBody: asExternalBusinessGroup
    });

  }

  public async update_ExternalBusinessGroup({ organizationId, asExternalBusinessGroup }:{
    organizationId: string;
    asExternalBusinessGroup: TASExternalBusinessGroup;
  }): Promise<void> {

    const apsBusinessGroupUpdate: APSBusinessGroupUpdate = {
      displayName: asExternalBusinessGroup.displayName,
      description: asExternalBusinessGroup.description,
    };

    await ApsBusinessGroupsService.updateApsBusinessGroup({
      organizationId: organizationId,
      businessgroupId: asExternalBusinessGroup.businessGroupId,
      requestBody: apsBusinessGroupUpdate
    });


  }


}

export default new AsBusinessGroupsService();




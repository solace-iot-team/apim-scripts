import AsUtils from "../../as-lib/AsUtils";
import AsBusinessGroupsService, { 
  TASExternalBusinessGroupTreeNode, TASExternalBusinessGroupTreeNodeList
} from "../../as-lib/AsBusinessGroupsService";
import { ExternalBusinessGroupImporter } from "./ExternalBusinessGroupImporter";
import Config from "../Config";
import { ApsBusinessGroupsService } from "@solace-iot-team/apim-server-openapi-node";

type TMuleSoftBusinessGroup = {
  name: string;
  id: string;
  subOrganizations: TMuleSoftBusinessGroupList;
}
type TMuleSoftBusinessGroupList = Array<TMuleSoftBusinessGroup>;

export class ExternalBusinessGroupImporter_MulesoftExchange extends ExternalBusinessGroupImporter {
  
  constructor({ organizationId, externalSystemId, data }:{
    organizationId: string;
    externalSystemId: string;
    data: any;
  }) {
    super({ 
      organizationId: organizationId,
      externalSystemId: externalSystemId,
      data: data.data
    });
  }

  private _getValue(mulesoftBusinessGroup: TMuleSoftBusinessGroup, key: keyof TMuleSoftBusinessGroup): string | TMuleSoftBusinessGroupList {
    const funcName = '_getValue';
    const logName = `${ExternalBusinessGroupImporter_MulesoftExchange.name}.${funcName}()`;
    const value = mulesoftBusinessGroup[key];
    if(value === undefined) throw new Error(`${logName}: ImportDataKeyNotFound: key=${key}, mulesoftBusinessGroup=${JSON.stringify(mulesoftBusinessGroup)}`);
    return value;
  }

  private async _parse_MuleSoftBusinessGroup({ muleSoftBusinessGroup, parentBusinessGroupId }:{
    muleSoftBusinessGroup: TMuleSoftBusinessGroup;
    parentBusinessGroupId: string;
  }): Promise<TASExternalBusinessGroupTreeNode> {
    const funcName = '_parse_MuleSoftBusinessGroup';
    const logName = `${ExternalBusinessGroupImporter_MulesoftExchange.name}.${funcName}()`;

    const name: string = this._getValue(muleSoftBusinessGroup, 'name') as string;
    const externalId: string = this._getValue(muleSoftBusinessGroup, 'id') as string;
    const subOrganizations: TMuleSoftBusinessGroupList = this._getValue(muleSoftBusinessGroup, 'subOrganizations') as TMuleSoftBusinessGroupList;
    // check if it exists
    const businessGroupId: string | undefined = await AsBusinessGroupsService.get_BusinessGroupId_By_ExternalBusinessGroupId({
      organizationId: Config.getOrganizationId(),
      externalBusinessGroupId: externalId
    });
    const exists: boolean = (businessGroupId !== undefined);
    console.log(`${logName}: exists=${exists}, name=${name}, businessGroupId=${businessGroupId} for externalBusinessGroupId=${externalId} and parentBusinessGroupId=${parentBusinessGroupId}`);

    // set internal id to uuid if new or existing one
    const internalBusinessGroupId: string = businessGroupId !== undefined ? businessGroupId : AsUtils.create_UUID();

    const treeNode: TASExternalBusinessGroupTreeNode = {
      exists: exists,
      externalBusinessGroup: {
        businessGroupId: internalBusinessGroupId,
        description: name,
        displayName: name,
        businessGroupParentId: parentBusinessGroupId,
        externalReference: {
          externalId: externalId,
          displayName: name,
          externalSystemId: this.externalSystemId,
        }
      },
      children: await this._parse_SubOrganizations({
        subOrganizations: subOrganizations,
        parentBusinessGroupId: internalBusinessGroupId
      })
    };
    return treeNode;
  }

  private async _parse_SubOrganizations({ subOrganizations, parentBusinessGroupId }: {
    subOrganizations: TMuleSoftBusinessGroupList;
    parentBusinessGroupId: string;
  }): Promise<TASExternalBusinessGroupTreeNodeList> {
    const treeNodeList: TASExternalBusinessGroupTreeNodeList = [];
    for(const muleSoftBusinessGroup of subOrganizations) {
      const treeNode: TASExternalBusinessGroupTreeNode = await this._parse_MuleSoftBusinessGroup({
        muleSoftBusinessGroup: muleSoftBusinessGroup,
        parentBusinessGroupId: parentBusinessGroupId
      });
      treeNodeList.push(treeNode);
    }
    return treeNodeList;
  }

  /**
   * Parses the data and creates the tree node list.
   */
  public async parse(): Promise<void> {
    const funcName = 'parse';
    const logName = `${ExternalBusinessGroupImporter_MulesoftExchange.name}.${funcName}()`;

    // there is only 1 root in the data
    const muleSoftRoot: TASExternalBusinessGroupTreeNode = await this._parse_MuleSoftBusinessGroup({
      muleSoftBusinessGroup: this.data,
      parentBusinessGroupId: this.organizationId
    });

    this.externalBusinessGroupTreeNodeList = [muleSoftRoot];

  }

}
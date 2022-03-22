import AsBusinessGroupsService, { 
  TASExternalBusinessGroupTreeNode,
  TASExternalBusinessGroupTreeNodeList
} from "../../as-lib/AsBusinessGroupsService";

export abstract class ExternalBusinessGroupImporter {
  protected readonly organizationId: string;
  protected readonly externalSystemId: string;
  protected readonly data: any;
  protected externalBusinessGroupTreeNodeList: TASExternalBusinessGroupTreeNodeList;
  
  constructor({ organizationId, externalSystemId, data }:{
    organizationId: string;
    externalSystemId: string;
    data: any;
  }) {
    this.organizationId = organizationId;
    this.externalSystemId = externalSystemId;
    this.data = data;
  }

  public async parse(): Promise<void> {
    const funcName = 'parse';
    const logName = `${ExternalBusinessGroupImporter.name}.${funcName}()`;
    throw new Error(`${logName}: ABSTRACT_METHOD_CALL`);
  }

  private async _present_ExternalBusinessGroupTreeNode({ externalBusinessGroupTreeNode }:{
    externalBusinessGroupTreeNode: TASExternalBusinessGroupTreeNode;
  }): Promise<Array<any>> {
    const funcName = '_present_ExternalBusinessGroupTreeNodeList';
    const logName = `${ExternalBusinessGroupImporter.name}.${funcName}()`;

    const log: Array<any> = [];

    if(externalBusinessGroupTreeNode.exists) {
      const logEntry: any = {};
      logEntry.action = 'UPDATING_EXTERNAL_BUSINESSGROUP';
      logEntry.details = {
        externalBusinessGroup: externalBusinessGroupTreeNode.externalBusinessGroup
      };
      console.log(`${logName}: action=${logEntry.action}, displayName=${externalBusinessGroupTreeNode.externalBusinessGroup.displayName}`);
      log.push(logEntry);
      // update
      await AsBusinessGroupsService.update_ExternalBusinessGroup({
        organizationId: this.organizationId,
        asExternalBusinessGroup: externalBusinessGroupTreeNode.externalBusinessGroup 
      });
    } else {
      const logEntry: any = {};
      logEntry.action = 'CREATING_EXTERNAL_BUSINESSGROUP';
      logEntry.details = {
        externalBusinessGroup: externalBusinessGroupTreeNode.externalBusinessGroup
      };
      log.push(logEntry);
      // create
      await AsBusinessGroupsService.create_ExternalBusinessGroup({
        organizationId: this.organizationId,
        asExternalBusinessGroup: externalBusinessGroupTreeNode.externalBusinessGroup
      });
    }
    // now walk through the children
    const childrenLog: Array<any> = await this._present_ExternalBusinessGroupTreeNodeList({
      externalBusinessGroupTreeNodeList: externalBusinessGroupTreeNode.children
    });
    log.push(...childrenLog);
    return log;
  }

  private async _present_ExternalBusinessGroupTreeNodeList({ externalBusinessGroupTreeNodeList }: {
    externalBusinessGroupTreeNodeList: TASExternalBusinessGroupTreeNodeList;
  }): Promise<Array<any>> {
    // TODO: create a log class
    const log: Array<any> = [];
    for(const externalBusinessGroupTreeNode of externalBusinessGroupTreeNodeList) {
      const treeNodelog: Array<any> = await this._present_ExternalBusinessGroupTreeNode({
        externalBusinessGroupTreeNode: externalBusinessGroupTreeNode
      });
      log.push(...treeNodelog);
    }
    return log;
  }


  public async present(): Promise<void> {
    const funcName = 'present';
    const logName = `${ExternalBusinessGroupImporter.name}.${funcName}()`;
    console.log(`${logName}: STARTING`);
    let log: Array<any> = [];
    try {
      log = await this._present_ExternalBusinessGroupTreeNodeList({
        externalBusinessGroupTreeNodeList: this.externalBusinessGroupTreeNodeList
      });
    } catch(e: any) {
      console.log(`${logName}: should rollback everything in log=${JSON.stringify(log, null, 2)}`);
      throw e;
    } finally {
      console.log(`${logName}: log = ${JSON.stringify(log, null, 2)}`);
    }
    console.log(`${logName}: FINISHED`);
  }


  public get_ExternalBusinessGroupTreeNodeList() { return this.externalBusinessGroupTreeNodeList; }

}
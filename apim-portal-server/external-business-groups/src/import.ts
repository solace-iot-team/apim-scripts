// import { PlatformAPIClient } from './lib/platformapiclient';
// import { CONSTANTS } from './constants';
// import ApigeeClient from './lib/apigee/ApigeeClient';
// import fs from 'fs';
// import path from 'path';
// import yaml from 'js-yaml';
// import { TApigeeApiProductInfo, TApigeeApiProductInfoList, TApigeeApiResourceList, TApigeeAppInfoList, TIntegrationDeveloperAppDetails } from './lib/apigee/types';
// import { AsyncTest, SolaceIntegration } from './lib/solace/SolaceIntegration';
// import { Helper } from './lib/helper';
// import { AdministrationService } from '@solace-iot-team/apim-connector-openapi-node';

import Config from './Config';
import AsOrganizationService from '../as-lib/AsOrganizationService';
import { ApsBusinessGroupsService } from '@solace-iot-team/apim-server-openapi-node';
import AsExternalSystemsService from '../as-lib/AsExternalSystemsService';

const ModuleName = 'aps-external-business-groups'
const ComponentName = 'import';

// pipeline
// const initializeConnectorOpenApi = () => {
//   const base: string = PlatformAPIClient.getBaseUrl(CONSTANTS.connectorApiConfig.protocol, CONSTANTS.connectorApiConfig.host, CONSTANTS.connectorApiConfig.port);
//   PlatformAPIClient.initialize(base, CONSTANTS.connectorApiConfig.user, CONSTANTS.connectorApiConfig.pwd);
// }

// const checkOrgExists = async () => {
//   const funcName = 'checkOrgExists';
//   const logName = `${ModuleName}.${funcName}()`;
//   console.log(`${logName} ...`);
//   try {
//     await AdministrationService.getOrganization({
//       organizationName: CONSTANTS.orgName
//     });
//   } catch(e) {
//     Helper.logError(e);
//     process.exit(1);
//   }
//   console.log(`${logName}: done.`);
// }

const validateConfigReferences = async() => {
  const funcName = 'validateConfigReferences';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;

  const organizationId = Config.getOrganizationId();
  const externalSystemId = Config.getExternalSystemId();

  const apsOrganizationExists: boolean = await AsOrganizationService.apsExists({
    organizationId: organizationId
  });
  if(!apsOrganizationExists) throw new Error(`${logName}: organizationId does not exist: ${organizationId}`);
  
  const apsExternalSystemExists = await AsExternalSystemsService.exists({
    organizationId: organizationId,
    externalSystemId: externalSystemId
  });
  if(!apsExternalSystemExists) throw new Error(`${logName}: externalSystemId does not exist: ${externalSystemId}`);

}

const main = async() => {
  const funcName = 'main';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;
  // AsLogger
  console.log(`${logName}: starting ... `);

  // const apsOrgList = await AsOrganizationService.listApsOrganizations();
  // console.log(`${logName}: apsOrgList = ${JSON.stringify(apsOrgList, null, 2)}`);
  // const apsExternalSystemList = await AsExternalSystemsService.list({
  //   organizationId: Config.getOrganizationId()
  // });
  // console.log(`${logName}: apsExternalSystemList = ${JSON.stringify(apsExternalSystemList, null, 2)}`);
  
  await validateConfigReferences();


  console.log(`${logName}: done.`);
}

const initialize = () => {
  const funcName = 'initialize';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;
  Config.initialize();
}

initialize();
main();

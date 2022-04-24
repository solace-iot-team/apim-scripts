
import Config from './Config';
import AsOrganizationService from '../as-lib/AsOrganizationService';
import AsExternalSystemsService from '../as-lib/AsExternalSystemsService';
import AsUtils from '../as-lib/AsUtils';
import AsLoginService from '../as-lib/AsLoginService';
import { APIProduct, ApiProductsService, App, AppsService, AppStatus } from '@solace-iot-team/apim-connector-openapi-node';

const ModuleName = 'aps-external-apps'
const ComponentName = 'main';

const validateConfigReferences = async() => {
  const funcName = 'validateConfigReferences';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;

  const organizationId = Config.getOrganizationId();

  const apsOrganizationExists: boolean = await AsOrganizationService.apsExists({
    organizationId: organizationId
  });
  if(!apsOrganizationExists) throw new Error(`${logName}: organizationId does not exist: ${organizationId}`);
  
}

const create_user_app = async({ userId, createAppRequestBody, appStatus }:{
  userId: string;
  createAppRequestBody: App;
  appStatus: AppStatus;
}): Promise<void> => {
  await AppsService.createDeveloperApp({
    organizationName: Config.getOrganizationId(),
    developerUsername: userId,
    requestBody: createAppRequestBody
  });
  await AppsService.updateDeveloperApp({
    organizationName: Config.getOrganizationId(),
    appName: createAppRequestBody.name,
    developerUsername: userId,
    requestBody: {
      status: appStatus
    }
  });
}

const create_team_app = async({ teamId, createAppRequestBody, appStatus }:{
  teamId: string;
  createAppRequestBody: App;
  appStatus: AppStatus;
}): Promise<void> => {
  await AppsService.createTeamApp({
    organizationName: Config.getOrganizationId(),
    teamName: teamId,
    requestBody: createAppRequestBody
  });
  await AppsService.updateTeamApp({
    organizationName: Config.getOrganizationId(),
    appName: createAppRequestBody.name,
    teamName: teamId,
    requestBody: {
      status: appStatus
    }
  });
}

const create_apps = async() => {
  const funcName = 'create_apps';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;

  // get the first two api products
  const complete_ApiProductList: Array<APIProduct> = await ApiProductsService.listApiProducts({
    organizationName: Config.getOrganizationId(),
  });
  // console.log(`${logName}: apiProductList.length=${apiProductList.length}`);
  // find 2 api products, one manual, one auto
  const manual_ApiProduct: APIProduct | undefined = complete_ApiProductList.find( (x) => {
    return x.approvalType === APIProduct.approvalType.MANUAL;
  });
  if(manual_ApiProduct === undefined) throw new Error(`${logName}: cannot find a manual approval API product`);
  const auto_ApiProduct: APIProduct | undefined = complete_ApiProductList.find( (x) => {
    return x.approvalType === APIProduct.approvalType.AUTO;
  });
  if(auto_ApiProduct === undefined) throw new Error(`${logName}: cannot find a auto approval API product`);

  const apiProductIdList: Array<string> = [
    manual_ApiProduct.name, 
    auto_ApiProduct.name
  ];

  const userId1: string = "user.one@devel.test";
  const userId2: string = "user.two@devel.test";
  const userId3: string = "user.three@devel.test";
  const userAppId1: string = 'external-user-app-1_at_' + Date.now();
  const userAppId2: string = 'external-user-app-2_at_' + Date.now();
  const userAppId3: string = 'external-user-app-3_at_' + Date.now();
  
  const teamId1: string = "team-one";
  const teamId2: string = "team-two";
  const teamId3: string = "team-three";
  const teamAppId1: string = 'external-team-app-1_at_' + Date.now();
  const teamAppId2: string = 'external-team-app-2_at_' + Date.now();
  const teamAppId3: string = 'external-team-app-3_at_' + Date.now();

  const expiresIn: number = 3600; // 1 hour

  const appRequestBody: App = {
    name: userAppId1,
    expiresIn: expiresIn,
    apiProducts: apiProductIdList,
    credentials: {}
  };
  // create user app 1
  await create_user_app({ 
    userId: userId1, 
    appStatus: AppStatus.APPROVED,
    createAppRequestBody: appRequestBody
  });
  // create user app 2
  appRequestBody.name = userAppId2;
  await create_user_app({
    userId: userId2, 
    appStatus: AppStatus.PENDING,
    createAppRequestBody: appRequestBody
  });
  // create user app 3
  appRequestBody.name = userAppId3;
  await create_user_app({
    userId: userId3, 
    appStatus: AppStatus.REVOKED,
    createAppRequestBody: appRequestBody
  });
  // create team app 1
  appRequestBody.name = teamAppId1;
  await create_team_app({
    teamId: teamId1,
    appStatus: AppStatus.APPROVED,
    createAppRequestBody: appRequestBody
  });
  // create team app 2
  appRequestBody.name = teamAppId2;
  await create_team_app({
    teamId: teamId2,
    appStatus: AppStatus.PENDING,
    createAppRequestBody: appRequestBody
  });
  // create team app 3
  appRequestBody.name = teamAppId3;
  await create_team_app({
    teamId: teamId3,
    appStatus: AppStatus.REVOKED,
    createAppRequestBody: appRequestBody
  });

}

const main = async() => {
  const initialize = async() => {
    const funcName = 'initialize';
    const logName = `${ModuleName}.${ComponentName}.${funcName}()`;
    await Config.initialize();
  }
    const funcName = 'main';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;
  // AsLogger
  console.log(`${logName}: starting ... `);

  await initialize();

  await validateConfigReferences();

  await create_apps();

  console.log(`${logName}: done.`);
}

main();

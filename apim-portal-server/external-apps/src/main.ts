
import Config from './Config';
import AsOrganizationService from '../as-lib/AsOrganizationService';
import AsExternalSystemsService from '../as-lib/AsExternalSystemsService';
import AsUtils from '../as-lib/AsUtils';
import AsLoginService from '../as-lib/AsLoginService';
import { APIProduct, ApiProductsService, App, AppsService } from '@solace-iot-team/apim-connector-openapi-node';

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

// const importData = async() => {
//   const funcName = 'importData';
//   const logName = `${ModuleName}.${ComponentName}.${funcName}()`;


//   const businessGroupData: any = AsUtils.readFileContentsAsJson(Config.getBusinessGroupImportFilePath());
//   // console.log(`${logName}: businessGroupAny = ${JSON.stringify(businessGroupAny)}`);

//   const importer: ExternalBusinessGroupImporter = ExternalBusinessGroupImporterFactory.create_ExternalBusinessGroupImporter({
//     organizationId: Config.getOrganizationId(),
//     externalSystemId: Config.getExternalSystemId(),
//     businessGroupData: businessGroupData
//   });

//   const v: void = await importer.parse();
//   const vv: void = await importer.present();

// }


const create_user_apps = async() => {
  const funcName = 'create_user_apps';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;

  // get the first two api products
  const apiProductList: Array<APIProduct> = await ApiProductsService.listApiProducts({
    organizationName: Config.getOrganizationId(),
    pageNumber: 1,
    pageSize: 2
  });

  console.log(`${logName}: apiProductList.length=${apiProductList.length}`);

  const apiProductIdList: Array<string> = apiProductList.map( (apiProduct: APIProduct) => {
    return apiProduct.name;
  });

  const userId1: string = "user.one@devel.test";
  const userId2: string = "user.two@devel.test";
  const userAppId1: string = 'external-user-app-1_at_' + Date.now();
  const userAppId2: string = 'external-user-app-2_at_' + Date.now();
  
  const teamId1: string = "team-one";
  const teamId2: string = "team-two";
  const teamAppId1: string = 'external-team-app-1_at_' + Date.now();
  const teamAppId2: string = 'external-team-app-2_at_' + Date.now();


  const expiresIn: number = 3600; // 1 hour

  // create user app 1
  const appRequestBody: App = {
    name: userAppId1,
    expiresIn: expiresIn,
    apiProducts: apiProductIdList,
    credentials: {}
  }
  await AppsService.createDeveloperApp({
    organizationName: Config.getOrganizationId(),
    developerUsername: userId1,
    requestBody: appRequestBody
  });
  // create user app 2
  appRequestBody.name = userAppId2;
  await AppsService.createDeveloperApp({
    organizationName: Config.getOrganizationId(),
    developerUsername: userId2,
    requestBody: appRequestBody
  });
  // create team app 1
  appRequestBody.name = teamAppId1;
  await AppsService.createTeamApp({
    organizationName: Config.getOrganizationId(),
    teamName: teamId1,
    requestBody: appRequestBody
  });
  // create team app 2
  appRequestBody.name = teamAppId2;
  await AppsService.createTeamApp({
    organizationName: Config.getOrganizationId(),
    teamName: teamId2,
    requestBody: appRequestBody
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

  await create_user_apps();

  console.log(`${logName}: done.`);
}

main();

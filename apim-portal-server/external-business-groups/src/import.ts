
import Config from './Config';
import AsOrganizationService from '../as-lib/AsOrganizationService';
import AsExternalSystemsService from '../as-lib/AsExternalSystemsService';
import AsUtils from '../as-lib/AsUtils';
import ExternalBusinessGroupImporterFactory from './integration/ExternalBusinessGroupImporterFactory';
import { ExternalBusinessGroupImporter } from './integration/ExternalBusinessGroupImporter';
import AsLoginService from '../as-lib/AsLoginService';

const ModuleName = 'aps-external-business-groups'
const ComponentName = 'import';

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

const importData = async() => {
  const funcName = 'importData';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;

  const businessGroupData: any = AsUtils.readFileContentsAsJson(Config.getBusinessGroupImportFilePath());
  // console.log(`${logName}: businessGroupAny = ${JSON.stringify(businessGroupAny)}`);

  const importer: ExternalBusinessGroupImporter = ExternalBusinessGroupImporterFactory.create_ExternalBusinessGroupImporter({
    organizationId: Config.getOrganizationId(),
    externalSystemId: Config.getExternalSystemId(),
    businessGroupData: businessGroupData
  });

  const v: void = await importer.parse();
  const vv: void = await importer.present();

}

const main = async() => {
  const funcName = 'main';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;
  // AsLogger
  console.log(`${logName}: starting ... `);
  
  await validateConfigReferences();

  await importData();

  await AsLoginService.logoutOrganizationAll({
    organizationId: Config.getOrganizationId()
  });

  console.log(`${logName}: done.`);
}

const initialize = () => {
  const funcName = 'initialize';
  const logName = `${ModuleName}.${ComponentName}.${funcName}()`;
  Config.initialize();
}

initialize();
main();

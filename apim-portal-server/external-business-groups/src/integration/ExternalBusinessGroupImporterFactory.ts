import AsUtils from "../../as-lib/AsUtils";
import { ExternalBusinessGroupImporter } from "./ExternalBusinessGroupImporter";
import { ExternalBusinessGroupImporter_MulesoftExchange } from "./ExternalBusinessGroupImporter_MulesoftExchange";

const TypeKey = 'type';
enum ETypeValue {
  MULESOFT_EXCHANGE = "mulesoft-exchange",
}

class ExternalBusinessGroupImporterFactory {

  public create_ExternalBusinessGroupImporter({ organizationId, externalSystemId, businessGroupData }:{
    organizationId: string;
    externalSystemId: string;
    businessGroupData: any;
  }): ExternalBusinessGroupImporter {
    const funcName = 'ExternalBusinessGroupImporterFactory';
    const logName = `${ExternalBusinessGroupImporterFactory.name}.${funcName}()`;

    // check the type
    if(businessGroupData[TypeKey] === undefined) throw new Error(`${logName}: businessGroupData[${TypeKey}] === undefined`);
    const type: ETypeValue = businessGroupData[TypeKey];
    switch(type) {
      case ETypeValue.MULESOFT_EXCHANGE:
        const importer: ExternalBusinessGroupImporter = new ExternalBusinessGroupImporter_MulesoftExchange({
          organizationId: organizationId,
          externalSystemId: externalSystemId,
          data: businessGroupData
        });
        return importer;
      default:
        AsUtils.assertNever(logName, type);
    }
    throw new Error(`${logName}: never gets here`);
  }

}

export default new ExternalBusinessGroupImporterFactory();
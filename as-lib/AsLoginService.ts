
import { 
  ApsLoginService, 
} from "@solace-iot-team/apim-server-openapi-node";


class AsLoginService {

  public async logoutOrganizationAll({ organizationId }: {
    organizationId: string;
  }): Promise<void> {

    await ApsLoginService.logoutOrganizationAll({
      organizationId: organizationId
    });

  }

}

export default new AsLoginService();




import { Transformadores } from 'src/utils/helpers';
import { UserRoles } from '../model/user-roles.model';

export class RolesRepository {
  public static async verRoles() {
    return Transformadores.extraerDataValues(
      await UserRoles.findAll({
        attributes: ['type', 'id']
      })
    );
  }
}

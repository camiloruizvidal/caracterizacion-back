import { UserRoles } from '../model/user-roles.model';

export class RolesRepository {
  public static async verRoles() {
    const roles = await UserRoles.findAll();
    return roles.map(rol => rol.dataValues);
  }
}

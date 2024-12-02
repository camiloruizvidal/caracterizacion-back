import { Transformadores } from 'src/utils/helpers';
import { Version } from '../model/version.model';

export class VersionRepository {
  public static async obtenerUltimaVersion() {
    return Transformadores.extraerDataValues(
      await Version.findOne({ order: [['id', 'DESC']] })
    );
  }
}

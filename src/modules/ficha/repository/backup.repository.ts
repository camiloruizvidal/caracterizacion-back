import { Transformadores } from 'src/utils/helpers';
import { Backup } from '../model/backup.model';

export class BackupRepository {
  public static async verBackupsPaginados(
    paginaActual: number = 1,
    registrosPorPagina: number = 10
  ) {
    const offset = (paginaActual - 1) * registrosPorPagina;
    const resultados = await Backup.findAndCountAll({
      limit: 1,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    resultados.rows = Transformadores.extraerDataValues(
      resultados.rows.map(resultado => JSON.parse(resultado.data))
    );
    return resultados;
  }
}

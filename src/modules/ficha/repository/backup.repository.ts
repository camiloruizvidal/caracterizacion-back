import { Transformadores } from 'src/utils/helpers';
import { Backup } from '../model/backup.model';

export class BackupRepository {
  public static async verBackupsPaginados(
    paginaActual: number = 1,
    registrosPorPagina: number = 10
  ) {
    const offset = (paginaActual - 1) * registrosPorPagina;
    const resultados = Transformadores.extraerDataValues(
      await Backup.findAndCountAll({
        limit: registrosPorPagina,
        offset: offset
      })
    );
    resultados.rows.map(row => {
      row.data = JSON.parse(row.data);
      return row;
    });
    return resultados;
  }

  public static async guardarBackup(data: string) {
    return await Backup.create({ data });
  }
}

import { Alertas } from '../model/alertas.model';

export class AlertasRepository {
  public static async obtenerAlertas() {
    return await Alertas.findAll({
      order: [['nombre', 'ASC']]
    });
  }
}

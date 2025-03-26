import { Carga } from '../model/carga.model';
import { EEstadoCargaEnum } from '../enums/estado-carga.enum';

export class CargaRepository {
  static async crearCarga(fichaId: number, urlArchivo: string): Promise<Carga> {
    return await Carga.create({
      fichaId,
      urlArchivo,
      estado: EEstadoCargaEnum.INGRESADO
    });
  }

  static async obtenerCargaPorId(id: number): Promise<Carga | null> {
    return await Carga.findByPk(id, {
      include: ['ficha']
    });
  }

  static async actualizarEstadoCarga(
    id: number,
    estado: EEstadoCargaEnum,
    mensajeError?: string
  ): Promise<Carga | null> {
    const carga = await Carga.findByPk(id);
    if (carga) {
      await carga.update({
        estado,
        mensajeError
      });
    }
    return carga;
  }

  static async actualizarCantidadRegistros(
    id: number,
    cantidadRegistros: number
  ): Promise<[number, Carga[]]> {
    return await Carga.update(
      { cantidadRegistros },
      {
        where: { id },
        returning: true
      }
    );
  }
}

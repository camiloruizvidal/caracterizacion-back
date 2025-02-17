import { Ficha } from '../model/ficha.model';
import { Transformadores } from 'src/utils/helpers';

export class FichaRepository {
  public static async crearFicha(
    userId: number,
    version: number,
    code: number,
    dateRegister: Date
  ): Promise<Ficha> {
    const fichaCreada = await Ficha.create({
      usuarioCreacionId: userId,
      version: version,
      codigo: code,
      fechaRegistro: dateRegister
    });

    return Transformadores.extraerDataValues(fichaCreada);
  }

  public static async obtenerFicha(id: number): Promise<any[]> {
    return Transformadores.extraerDataValues(
      await Ficha.findOne({ where: { id } })
    );
  }
}

import { Log } from '../model/log.model';

export class LogRepository {
  public static async guardarData(data: string, tipo = null) {
    await Log.create({
      data,
      tipo
    });
  }
}

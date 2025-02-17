import { Injectable } from '@nestjs/common';
import { AlertasRepository } from '../repository/alertas.repository';

@Injectable()
export class AlertasService {
  public async obtenerAlertas() {
    return await AlertasRepository.obtenerAlertas();
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  GatewayTimeoutException,
  InternalServerErrorException
} from '@nestjs/common';
import { Constantes } from './constantes';

@Injectable()
export class ManejadorErrorService {
  /**
   * Manejo de error generado por el api
   *
   * @param {*} error
   */
  public resolverErrorApi(error: any): void {
    const mensajeTiempoExcedido = Constantes.MENSAJE_TIEMPO_EXCEDIDO;
    const esPeticionIncorrecta = this.esPeticionIncorrecta(error);
    const esNoEncontrado = this.esNoEncontrado(error);
    const esTiempoExcedido = this.esTiempoExcedido(
      error,
      mensajeTiempoExcedido
    );
    console.error(error);

    if (esTiempoExcedido) {
      //Timeout
      throw new GatewayTimeoutException(error.message);
    } else if (esPeticionIncorrecta) {
      // Error 400
      throw new BadRequestException(error.message);
    } else if (esNoEncontrado) {
      // Error 404
      throw new NotFoundException(error.message);
    } else if (error.response?.data) {
      // Error 500 Respuesta de api
      this.mostrarErrorInterno();
    } else {
      this.mostrarErrorInterno();
    }
  }

  private esPeticionIncorrecta(error: any): boolean {
    return (
      error.status === 400 ||
      error.code === 400 ||
      error.codigo === 400 ||
      error.response?.status === 400
    );
  }

  private esNoEncontrado(error: any): boolean {
    return (
      error.status === 404 ||
      error.code === 404 ||
      error.codigo === 404 ||
      error.response?.status === 404
    );
  }

  private esTiempoExcedido(error: any, mensajeTiempoExcedido: string): boolean {
    return (
      (error?.code === Constantes.CONEXION_ABORTADA && error?.message) ||
      error.message === mensajeTiempoExcedido
    );
  }

  private mostrarErrorInterno(): void {
    throw new InternalServerErrorException(Constantes.MENSAJE_ERROR_INTERNO);
  }
}

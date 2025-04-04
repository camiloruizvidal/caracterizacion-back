import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GeneracionExcelRepository } from '../repository/generacion-excel.repository';
import { EEstadoGeneracionExcel } from '../models/generacion-excel.model';

@Injectable()
export class VerificarEstadoExcelMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const url = req.url;
      const rutaArchivo = url.split('/public/')[1];

      if (!rutaArchivo) {
        throw new HttpException(
          'Ruta de archivo no válida',
          HttpStatus.BAD_REQUEST
        );
      }

      const rutaNormalizada = rutaArchivo.replace(/\//g, '\\');

      const registro =
        await GeneracionExcelRepository.obtenerPorRutaArchivo(rutaNormalizada);

      if (!registro) {
        throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
      }

      if (registro.estado !== EEstadoGeneracionExcel.COMPLETADO) {
        res.status(HttpStatus.FORBIDDEN).json({
          code: HttpStatus.FORBIDDEN,
          msj: 'El archivo está en proceso de generación',
          data: {
            estado: registro.estado,
            progreso: registro.registrosProcesados,
            total: registro.totalRegistros
          }
        });
        return;
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al verificar el estado del archivo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

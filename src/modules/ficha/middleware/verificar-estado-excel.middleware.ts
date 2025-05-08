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
      console.log('URL recibida:', url);

      const rutaArchivo = url.split('/public/')[1];
      console.log('Ruta del archivo extraída:', rutaArchivo);

      if (!rutaArchivo) {
        console.log('Error: Ruta de archivo no válida');
        throw new HttpException(
          'Ruta de archivo no válida',
          HttpStatus.BAD_REQUEST
        );
      }

      const rutaNormalizada = rutaArchivo.replace(/\//g, '\\');
      console.log('Ruta normalizada:', rutaNormalizada);

      const registro =
        await GeneracionExcelRepository.obtenerPorRutaArchivo(rutaNormalizada);
      console.log('Registro encontrado:', registro);

      if (!registro) {
        console.log('Error: Archivo no encontrado en la base de datos');
        throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
      }

      if (registro.estado !== EEstadoGeneracionExcel.COMPLETADO) {
        console.log('Archivo en proceso:', {
          estado: registro.estado,
          progreso: registro.registrosProcesados,
          total: registro.totalRegistros
        });
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

      console.log('Archivo listo para descarga');
      next();
    } catch (error) {
      console.error('Error en middleware:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

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

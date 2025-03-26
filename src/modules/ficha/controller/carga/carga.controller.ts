import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargaService } from '../../service/carga/carga.service';
import { ManejadorErrorService } from './../../../../utils/manejador-error.service';
import { ArchivosService } from './../../../../utils/archivos.service';
import { Response } from 'express';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';

@Controller('api/v1/carga')
export class CargaController {
  constructor(
    private readonly manejadorErrorService: ManejadorErrorService,
    private readonly archivosService: ArchivosService,
    private readonly cargaService: CargaService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('excel'))
  async crearCarga(
    @UploadedFile() file: Express.Multer.File,
    @Body('fichaId') fichaId: number,
    @Res() res: Response
  ) {
    try {
      const urlArchivo = this.archivosService.guardarArchivo(file);
      const carga = await CargaService.crearCarga(fichaId, urlArchivo);

      // Enviar respuesta inmediata
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        msj: 'Carga creada exitosamente',
        data: {
          id: carga.id,
          estado: carga.estado
        }
      });

      // Procesar el archivo Excel de forma asíncrona
      this.cargaService
        .procesarArchivoExcel(carga.id, urlArchivo)
        .catch(error => {
          console.error('Error al procesar el archivo Excel:', error);
          CargaService.actualizarEstadoCarga(
            carga.id,
            EEstadoCargaEnum.ERROR,
            error.message
          );
        });
    } catch (error) {
      return this.manejadorErrorService.resolverErrorApi(error);
    }
  }

  @Get(':id')
  async obtenerCargaPorId(@Param('id') id: string) {
    try {
      const carga = await CargaService.obtenerCargaPorId(Number(id));
      return {
        code: HttpStatus.OK,
        msj: 'Carga encontrada',
        data: {
          id: carga.id,
          estado: carga.estado,
          cantidad_registros: carga.cantidadRegistros,
          mensaje_error: carga.mensajeError
        }
      };
    } catch (error) {
      return this.manejadorErrorService.resolverErrorApi(error);
    }
  }
}

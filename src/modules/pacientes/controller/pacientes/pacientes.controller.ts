import { ManejadorErrorService } from './../../../../utils/manejador-error.service';
import { PacientesService } from './../../service/pacientes/pacientes.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/pacientes')
export class PacientesController {
  constructor(
    private pacientesService: PacientesService,
    private readonly manejadorErrorService: ManejadorErrorService
  ) {}

  @Post('carga')
  @UseInterceptors(FileInterceptor('pacientes'))
  async cargarArchivos(@UploadedFile() file: Express.Multer.File) {
    try {
      const data = this.pacientesService.cargaExcelMasivo(file);
      return {
        message: 'Archivo Excel subido correctamente',
        data
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('')
  async verPacientes(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    try {
      return await this.pacientesService.paginarPacientes({
        page: Number(page),
        pageSize: Number(pageSize)
      });
    } catch (error) {
      this.manejadorErrorService.resolverErrorApi(error);
    }
  }

  @Get('filtromaps')
  async filtrarPorGps() {
    try {
      return await this.pacientesService.filtrarPorGps();
    } catch (error) {
      return {
        error: 'Ocurrió un error al obtener los pacientes paginados.'
      };
    }
  }
}

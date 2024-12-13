import { plainToInstance } from 'class-transformer';
import { ManejadorErrorService } from './../../../../utils/manejador-error.service';
import { PacientesService } from './../../service/pacientes/pacientes.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PacientesPaginadosDto } from '../dto/pacientes-paginados.dto';
import { Response } from 'express';

@Controller('api/v1/pacientes')
export class PacientesController {
  constructor(
    private pacientesService: PacientesService,
    private readonly manejadorErrorService: ManejadorErrorService
  ) {}

  @Post('carga')
  @UseInterceptors(FileInterceptor('pacientes'))
  async cargarArchivos(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    try {
      res.send({
        message:
          'Carga de pacientes en proceso. Esto puede demorar debido a la' +
          'cantidad de registros a procesar. Por favor revise el log'
      });
      await this.pacientesService.cargaExcelMasivo(file);
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
      const pacientes = await this.pacientesService.paginarPacientes({
        page: Number(page),
        pageSize: Number(pageSize)
      });
      return plainToInstance(PacientesPaginadosDto, pacientes);
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

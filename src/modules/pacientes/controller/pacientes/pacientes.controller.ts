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
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PacientesPaginadosDto } from '../dto/pacientes-paginados.dto';

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
      const data = await this.pacientesService.cargaExcelMasivo(file);
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
      const pacientes = await this.pacientesService.paginarPacientes({
        page: Number(page),
        pageSize: Number(pageSize)
      });
      pacientes.data = pacientes.data.map(paciente => {
        paciente['nombre_primero'] = paciente.nombrePrimero;
        paciente['nombre_segundo'] = paciente.nombreSegundo;
        paciente['apellido_primero'] = paciente.apellidoPrimero;
        paciente['apellido_segundo'] = paciente.apellidoSegundo;
        paciente['documento_tipo'] = paciente.documentoTipo;
        paciente['documento_numero'] = paciente.documentoNumero;
        delete paciente.nombrePrimero;
        delete paciente.nombreSegundo;
        delete paciente.apellidoPrimero;
        delete paciente.apellidoSegundo;
        delete paciente.documentoTipo;
        delete paciente.documentoNumero;
        return paciente;
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

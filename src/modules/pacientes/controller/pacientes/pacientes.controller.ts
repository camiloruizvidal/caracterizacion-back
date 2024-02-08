import { PacientesService } from './../../service/pacientes/pacientes.service';
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/pacientes')
export class PacientesController {
  constructor(private pacientesService: PacientesService) {}

  @Post('carga')
  @UseInterceptors(FileInterceptor('pacientes'))
  async cargarArchivos(@UploadedFile() file: Express.Multer.File) {
    try {
      const data = this.pacientesService.cargaExcelMasivo(file);
      return {
        message: 'Archivo Excel subido correctamente',
        data
      };
    } catch (error) {}
  }

  @Get('')
  async verPacientes(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10
  ) {
    try {
      return await this.pacientesService.paginarPacientes({
        page,
        perPage
      });
    } catch (error) {
      return {
        error: 'Ocurrió un error al obtener los pacientes paginados.'
      };
    }
  }
}

import { PacientesService } from './../../service/pacientes/pacientes.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/pacientes')
export class PacientesController {
  constructor(private pacientesService: PacientesService) {}

  @Post('carga')
  @UseInterceptors(FileInterceptor('pacientes'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const data = this.pacientesService.cargaExcelMasivo(file);
      return {
        message: 'Archivo Excel subido correctamente',
        data
      };
    } catch (error) {}
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { PacienteEntity } from '../../entity/pacientes.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>
  ) {}

  public cargaExcelMasivo(file: Express.Multer.File) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetNames = workbook.SheetNames;
      const data = [];

      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        data.push(...rows);
      }

      return 'carga exitosa';
    } catch (error) {
      throw error.message;
    }
  }

  private insertarDatos(datos: any) {
    
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { PacienteEntity } from '../../entity/pacientes.entity';
import { IPacienteImportExcel } from '../../interface/pacientes.interdace';
import {
  IPaginationResult,
  ISearchPagination
} from 'src/utils/global.interface';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>
  ) {}

  public async paginarPacientes(
    search: ISearchPagination
  ): Promise<IPaginationResult> {
    try {
      const [data, totalItems] = await this.pacienteRepository.findAndCount({
        take: search.perPage,
        skip: search.perPage * (search.page - 1)
      });

      const totalPages = Math.ceil(totalItems / search.perPage);

      return {
        data,
        page: search.page,
        itemsPerPage: search.perPage,
        totalItems,
        totalPages
      };
    } catch (error) {
      throw 'Ocurrió un error al obtener los pacientes paginados.';
    }
  }

  public cargaExcelMasivo(file: Express.Multer.File) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetNames = workbook.SheetNames;

      const worksheet = workbook.Sheets[sheetNames[0]];
      this.insertarDatos(XLSX.utils.sheet_to_json(worksheet));

      return 'carga exitosa';
    } catch (error) {
      throw error.message;
    }
  }

  private async insertarDatos(registrosPaciente: IPacienteImportExcel[]) {
    const registrosPacienteEntity = registrosPaciente.map(
      (registro: IPacienteImportExcel) => ({
        nombre_primero: registro.primer_nombre,
        nombre_segundo: registro?.segundo_nombre,
        apellido_primero: registro.primer_apellido,
        apellido_segundo: registro?.segundo_apellido,
        documento: registro.documento
      })
    );

    for (const pacienteData of registrosPacienteEntity) {
      const existingPaciente = await this.pacienteRepository.findOne({
        where: { documento_numero: pacienteData.documento }
      });

      if (existingPaciente) {
        await this.pacienteRepository.update(existingPaciente.id, pacienteData);
      } else {
        await this.pacienteRepository.save(
          this.pacienteRepository.create(pacienteData)
        );
      }
    }
  }
}

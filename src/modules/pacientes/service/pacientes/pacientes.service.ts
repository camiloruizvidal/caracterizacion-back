import { BadRequestException, Injectable } from '@nestjs/common';
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
        take: search.pageSize,
        skip: search.pageSize * (search.page - 1)
      });
      const totalPages = Math.ceil(totalItems / search.pageSize);

      return {
        data: [data[0]],
        currentPage: Number(search.page),
        itemsPerPage: Number(search.pageSize),
        totalItems: 1,
        totalPages: 1
      };
    } catch (error) {
      throw 'Ocurrió un error al obtener los pacientes paginados.';
    }
  }

  public async filtrarPorGps() {}

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
        documento_numero: registro?.documento_numero,
        fecha_nacimiento: new Date(registro?.fecha_nacimiento),
        sexo: registro?.sexo,
        parentesco: registro?.parentesco,
        ocupacion: registro?.ocupacion,
        aporta_ingresos: registro?.aporta_ingresos,
        nivel_escolaridad: registro?.nivel_escolaridad,
        afilicion_salud_tipo: registro?.afilicion_salud_tipo,
        grupo_atencion_especial: registro?.grupo_atencion_especial,
        discapacidad: registro?.discapacidad
      })
    );

    for (const pacienteData of registrosPacienteEntity) {
      const existingPaciente = await this.pacienteRepository.findOne({
        where: { documento_numero: pacienteData.documento_numero }
      });
      try {
        if (existingPaciente) {
          await this.pacienteRepository.update(
            existingPaciente.id,
            pacienteData
          );
        } else {
          await this.pacienteRepository.save(
            this.pacienteRepository.create(pacienteData)
          );
        }
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  }
}

import { ArchivosService } from './../../../../utils/archivos.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../../entity/pacientes.entity';
import { IPacienteImportExcel } from '../../interface/pacientes.interdace';
import { ISearchPagination, IPagination } from 'src/utils/global.interface';
import { PacienteRepository } from '../../repository/paciente.repository';
import { ExcelService } from 'src/utils/excel.service';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>
  ) {}

  public async paginarPacientes(
    parametros: ISearchPagination
  ): Promise<IPagination<any>> {
    try {
      return await PacienteRepository.verPacientesPaginado(parametros);
    } catch (error) {
      throw 'Ocurrió un error al obtener los pacientes paginados.';
    }
  }

  public async filtrarPorGps() {}

  public async cargaExcelMasivo(file: Express.Multer.File) {
    const archivosService: ArchivosService = new ArchivosService();
    const excelService: ExcelService = new ExcelService();

    try {
      const ruta = archivosService.guardarArchivo(file);
      const registrosXGrupos = 100;
      await excelService.iniciarLectura(ruta, registrosXGrupos);
      const totalRegistros: number = excelService.obtenerTotalRegistros();
      for (let i = 0; i < totalRegistros / registrosXGrupos; i++) {
        this.insertarDatos(excelService.obtenerRegistrosXGrupos(i));
      }
    } catch (error) {
      console.log({ error });
      throw error.message;
    }
  }

  private async insertarDatos(registrosPaciente: IPacienteImportExcel[]) {
    const registrosDePacientes = registrosPaciente.map(
      (registro: IPacienteImportExcel) => {
        return {
          documentoNumero: registro.documento_numero,
          nombrePrimero: registro.primer_nombre,
          nombreSegundo: registro?.segundo_nombre,
          apellidoPrimero: registro.primer_apellido,
          apellidoSegundo: registro?.segundo_apellido,
          fechaNacimiento: registro?.fecha_nacimiento
            ? new Date(registro?.fecha_nacimiento)
            : null,
          sexo: registro?.sexo,
          parentesco:
            registro?.parentesco === undefined ? null : registro?.parentesco,
          ocupacion: registro?.ocupacion,
          aportaIngresos: registro?.aporta_ingresos,
          nivelEscolaridad: registro?.nivel_escolaridad,
          tipoAfiliacionSalud: registro?.afilicion_salud_tipo,
          grupoAtencionEspecial: registro?.grupo_atencion_especial,
          discapacidad: registro?.discapacidad
        };
      }
    );

    await PacienteRepository.guardarPacientesBulk(registrosDePacientes);
  }
}

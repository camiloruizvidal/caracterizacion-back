import { Config } from './../../../../Config/Config';
import { ArchivosService } from './../../../../utils/archivos.service';
import { Injectable } from '@nestjs/common';
import { IPacienteImportExcel } from '../../interface/pacientes.interdace';
import { ISearchPagination, IPagination } from 'src/utils/global.interface';
import { PacienteRepository } from '../../repository/paciente.repository';
import { ExcelService } from 'src/utils/excel.service';
import { LogRepository } from 'src/modules/data/repository/log.repository';

@Injectable()
export class PacientesService {
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
      const registrosXGrupos = Config.CANTIDAD_REGISTROS_BULK;

      console.log('Va iniciar la lectura');
      await excelService.iniciarLectura(ruta, registrosXGrupos);
      console.log('Inicio la lectura');

      const totalRegistros = await excelService.obtenerTotalRegistros();
      const totalGrupos = Math.ceil(totalRegistros / registrosXGrupos);
      console.log({ totalRegistros });
      console.log({ registrosXGrupos, totalGrupos });
      const grupos = Array.from({ length: totalGrupos }, (_, index) => index);

      for (const i of grupos) {
        try {
          console.log(`Procesando grupo ${i} de ${totalGrupos}.`);
          await this.insertarDatos(
            await excelService.obtenerRegistrosXGrupos(i)
          );
          console.log(`Finalizando grupo ${i} de ${totalGrupos}.`);
        } catch (error) {
          console.error({ error });
          await LogRepository.guardarData(
            JSON.stringify(error),
            'cargaPacientes'
          );
        }
      }
      console.log('Finalizo');
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

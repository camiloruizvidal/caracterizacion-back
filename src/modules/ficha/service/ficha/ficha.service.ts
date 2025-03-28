import {
  ETipoGrupo,
  IFiltrosBusqueda
} from './../../../../utils/global.interface';
import { UsuarioRepository } from './../../../usuarios/repository/usuario.repository';
import { Injectable } from '@nestjs/common';
import { IFormulario, IAlerta } from '../../interface/ficha.interface';
import { IPagination } from 'src/utils/global.interface';
import { FichaGrupoRepository } from '../../repository/ficha-grupo.repository';
import { BackupRepository } from '../../repository/backup.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';
import { MapeoExcelRepository } from '../../repository/mapeo-excel.repository';
import { IFormatoMapeoExcel } from '../../interfaces/mapeo-excel.interface';

@Injectable()
export class FichaService {
  public async agregarTipoFicha(
    version: number,
    tipo: ETipoGrupo,
    titulo: string,
    alerta?: IAlerta
  ) {
    const ficha = await FichaJsonRepository.obtenerFichaJsonPorVersion(version);
    if (!ficha) {
      throw new Error('No se encontro la ficha');
    }

    return await FichaJsonRepository.insertarGrupoEnFichaJson(
      version,
      tipo,
      titulo,
      alerta
    );
  }

  public async obternerFormatoFicha(): Promise<IFormulario> {
    try {
      return await FichaJsonRepository.obtnerUltimaFichaActiva();
    } catch (error) {
      throw error.message;
    }
  }

  public async saveRegisterBackup(data: any): Promise<boolean> {
    try {
      const x = await BackupRepository.guardarBackup(JSON.stringify(data));
      console.log({ x });
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async loadFormsPage(
    page: number = 1,
    pageSize: number = 10
  ): Promise<IPagination<any>> {
    const registros = await BackupRepository.verBackupsPaginados(
      page,
      pageSize
    );
    const usuarios = await UsuarioRepository.obtenerTodosUsuarios();
    const data = await this.agregarUsuario(registros.rows, usuarios);
    return {
      data,
      totalItems: registros.count,
      currentPage: Number(page),
      totalPages: Math.ceil(registros.count / pageSize),
      itemsPerPage: Number(pageSize)
    };
  }

  private async agregarUsuario(data: any[], usuarios: any[]) {
    return data.map(formulario => {
      formulario['user'] = usuarios.find(
        usuario => formulario.data.userId === usuario.id
      );
      return formulario;
    });
  }

  public async obtenerGrupos(
    fichaId: number,
    tipo: 'grupal_data' | 'individual_data' = 'grupal_data'
  ) {
    try {
      return await FichaJsonRepository.obtenerGruposFichaJson(fichaId, tipo);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  public async agregarNuevoFormatoFicha(dataGrupalCard: any) {
    const ficha = await FichaJsonRepository.obtenerFichaJson(dataGrupalCard.id);
    if (ficha) {
      const x = await FichaJsonRepository.actualizarFichaJson(
        dataGrupalCard.id,
        {
          isFinish: dataGrupalCard.isFinish,
          version: dataGrupalCard.version,
          dateLastVersion: dataGrupalCard.dateLastVersion,
          grupalNombre: dataGrupalCard.grupalNombre,
          individualNombre: dataGrupalCard.individualNombre,
          grupalData: dataGrupalCard.grupalData,
          individualData: dataGrupalCard.individualData
        }
      );
      console.log({ x });
      return x;
    } else {
      const maxVersion = await FichaJsonRepository.verUltimaVersion();
      console.log({ maxVersion });
      return await FichaJsonRepository.agregarFichaJson({
        isFinish: dataGrupalCard.isFinish,
        version: maxVersion + 1,
        dateLastVersion: dataGrupalCard.dateLastVersion,
        grupalNombre: dataGrupalCard.grupalNombre,
        individualNombre: dataGrupalCard.individualNombre
      });
    }
  }

  public async obtenerFichaJson(version: number) {
    return await FichaJsonRepository.obtenerFichaJson(version);
  }

  public async guardarNuevoGrupo(data: any) {
    return await FichaGrupoRepository.guardarNuevoGrupo(data);
  }

  public async procesarFicha() {
    await FichaProcesadaRepository.procesarBackupsAlmacenadas(1);
  }

  public async obtenerVersiones(estadoFinalizado: boolean | null) {
    return await FichaJsonRepository.verVersiones(estadoFinalizado);
  }

  public async agregarNuevaVersion(data: {
    nombre: string;
    grupalNombre: string;
    individualNombre: string;
  }) {
    return await FichaJsonRepository.crearNuevaVersion(data);
  }

  public async buscarDinamicamente(filtros: IFiltrosBusqueda[]) {
    try {
      return await FichaJsonRepository.buscarResultadosDinamicos(filtros);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  public async guardarMapeoExcel(mapeo: IFormatoMapeoExcel): Promise<void> {
    try {
      // Validaciones de negocio
      if (!mapeo.fichaJsonId) {
        throw new Error('El ID de la ficha es requerido');
      }

      if (!mapeo.columnasExcel || mapeo.columnasExcel.length === 0) {
        throw new Error('Debe especificar al menos una columna de Excel');
      }

      if (!mapeo.mapeo || mapeo.mapeo.length === 0) {
        throw new Error('Debe especificar al menos un mapeo');
      }

      // Validar que todas las columnas de Excel estén mapeadas
      const columnasMapeadas = mapeo.mapeo.map(
        mapeoColumna => mapeoColumna.columnaExcel
      );
      const columnasSinMapear = mapeo.columnasExcel.filter(
        columnaExcel => !columnasMapeadas.includes(columnaExcel)
      );

      if (columnasSinMapear.length > 0) {
        throw new Error(
          `Las siguientes columnas no están mapeadas: ${columnasSinMapear.join(
            ', '
          )}`
        );
      }

      // Verificar si existe un mapeo para esta ficha
      const mapeoExistente = await MapeoExcelRepository.obtenerPorFicha(
        mapeo.fichaJsonId
      );

      if (mapeoExistente) {
        await MapeoExcelRepository.actualizar(mapeo.fichaJsonId, mapeo);
      } else {
        await MapeoExcelRepository.crear(mapeo);
      }
    } catch (error) {
      throw new Error('Error al guardar el mapeo de Excel: ' + error.message);
    }
  }

  public async obtenerEncabezadosExcel(
    fichaJsonId: number
  ): Promise<IFormatoMapeoExcel> {
    try {
      return await MapeoExcelRepository.obtenerEncabezadosPorFicha(fichaJsonId);
    } catch (error) {
      throw new Error(
        'Error al obtener los encabezados del Excel: ' + error.message
      );
    }
  }
}

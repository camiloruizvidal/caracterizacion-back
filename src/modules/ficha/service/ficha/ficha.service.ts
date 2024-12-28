import { UsuarioRepository } from './../../../usuarios/repository/usuario.repository';
import { FichaRepository } from './../../repository/ficha.repository';
import { Injectable } from '@nestjs/common';
import { IFichaCard } from '../../interface/ficha.interface';
import { IPagination } from 'src/utils/global.interface';
import { FichaGrupoRepository } from '../../repository/ficha-grupo.repository';
import { BackupRepository } from '../../repository/backup.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';

@Injectable()
export class FichaService {
  public async obternerFormatoFicha(): Promise<IFichaCard> {
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
    return data.map(IFamilyCard => {
      IFamilyCard['user'] = usuarios.find(
        usuario => IFamilyCard.data.userId === usuario.id
      );
      return IFamilyCard;
    });
  }

  public async loadFormsDetail(filtros: {
    fechaInicio: string;
    fechaFin: string;
    usuarioId: string;
    municipio: string;
    page: number;
    pageSize: number;
  }): Promise<IPagination<any>> {
    const fichas: IPagination<any> =
      await FichaRepository.cargarFichaPaginada(filtros);
    return fichas;
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
    console.log({ ficha });
    if (ficha) {
      return await FichaJsonRepository.actualizarFichaJson(dataGrupalCard.id, {
        isFinish: dataGrupalCard.isFinish,
        version: dataGrupalCard.version,
        dateLastVersion: dataGrupalCard.dateLastVersion,
        grupalNombre: dataGrupalCard.grupalNombre,
        individualNombre: dataGrupalCard.individualNombre
      });
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

  public async obtenerVersiones() {
    return await FichaJsonRepository.verVersiones();
  }

  public async agregarNuevaVersion(data: {
    nombre: string;
    grupalNombre: string;
    individualNombre: string;
  }) {
    return await FichaJsonRepository.crearNuevaVersion(data);
  }
}

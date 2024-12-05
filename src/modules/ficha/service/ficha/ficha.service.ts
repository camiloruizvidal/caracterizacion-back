import { UsuarioRepository } from './../../../usuarios/repository/usuario.repository';
import { FichaRepository } from './../../repository/ficha.repository';
import { Injectable } from '@nestjs/common';
import { IFichaCard } from '../../interface/ficha.interface';
import { IPagination } from 'src/utils/global.interface';
import { FichaDescripcionRepository } from '../../repository/ficha-descripcion.repository';
import { FichaTipoRepository } from '../../repository/ficha-tipo.repository';
import { FichaGrupoRepository } from '../../repository/ficha-grupo.repository';
import { BackupRepository } from '../../repository/backup.repository';
import { VersionRepository } from '../../repository/version.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';

@Injectable()
export class FichaService {
  public async obternerFormatoFicha(): Promise<IFichaCard> {
    try {
      const fichasGrupos: any[] = await FichaGrupoRepository.obtenerGrupos();
      const fichasDescripcion: any[] =
        await FichaDescripcionRepository.obtenerFichasDescripcion();

      const fichasTipo: any[] = await FichaTipoRepository.obtenerTiposFichas();

      const version = await VersionRepository.obtenerUltimaVersion();

      const dataFormateada: IFichaCard = {
        version: version.id.toString(),
        dateLastVersion: version.dateLastVersion,
        familyCard: [],
        personCard: []
      };

      const fichasResult = fichasGrupos.map(grupos => {
        grupos['values'] =
          fichasDescripcion
            .filter((ficha: any) => ficha.ficha_grupo_id == grupos.id)
            .map((ficha: any) => {
              ficha.options = JSON.parse(ficha.options);
              ficha.visibility = JSON.parse(ficha.visibility);
              ficha.required = JSON.parse(ficha.required);
              ficha['value'] = ficha.default;
              return ficha;
            }) || [];

        return grupos;
      });

      fichasTipo.forEach((tipos: any) => {
        dataFormateada[tipos.nombre] = fichasResult.filter(
          ficha => ficha.ficha_tipo_id === tipos.id
        );
      });

      return dataFormateada;
    } catch (error) {
      throw error.message;
    }
  }

  public async saveRegisterBackup(data: any): Promise<boolean> {
    try {
      await BackupRepository.guardarBackup(data);
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

  public async obtenerGrupos() {
    try {
      return await FichaGrupoRepository.obtenerGrupos();
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  public async agregarNuevoFormatoFicha(dataFamilyCard: any) {
    const ficha = await FichaJsonRepository.obtenerFichaJson(dataFamilyCard.id);
    if (ficha) {
      return await FichaJsonRepository.actualizarFichaJson(dataFamilyCard.id, {
        isFinish: dataFamilyCard.isFinish,
        version: dataFamilyCard.version,
        dateLastVersion: dataFamilyCard.dateLastVersion,
        familyCard: dataFamilyCard.familyCard,
        personCard: dataFamilyCard.personCard
      });
    } else {
      return await FichaJsonRepository.agregarFichaJson({
        isFinish: dataFamilyCard.isFinish,
        version: dataFamilyCard.version,
        dateLastVersion: dataFamilyCard.dateLastVersion,
        familyCard: dataFamilyCard.familyCard,
        personCard: dataFamilyCard.personCard
      });
    }
  }

  public async obtenerFichaJson(id: number) {
    return await FichaJsonRepository.obtenerFichaJson(id);
  }

  public async guardarNuevoGrupo(data: any) {
    return await FichaGrupoRepository.guardarNuevoGrupo(data);
  }

  public async procesarFicha() {
    await FichaProcesadaRepository.procesarBackupsAlmacenadas(1);
  }
}

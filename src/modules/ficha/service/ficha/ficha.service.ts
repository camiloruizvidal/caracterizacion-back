import {
  ETipoGrupo,
  IFiltrosBusqueda
} from './../../../../utils/global.interface';
import { UsuarioRepository } from './../../../usuarios/repository/usuario.repository';
import { Injectable, Inject } from '@nestjs/common';
import {
  IFormulario,
  IAlerta,
  ICategoria
} from '../../interface/ficha.interface';
import { IPagination } from 'src/utils/global.interface';
import { FichaGrupoRepository } from '../../repository/ficha-grupo.repository';
import { BackupRepository } from '../../repository/backup.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';
import { MapeoExcelRepository } from '../../repository/mapeo-excel.repository';
import { IFormatoMapeoExcel } from '../../interfaces/mapeo-excel.interface';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { FichaRepository } from '../../repository/ficha.repository';

interface IResultadoCSV {
  id: number;
  codigo: number;
  date_register: Date;
  caracterizador_nombre: string;
  caracterizador_documento: string;
  grupo_titulo: string;
  pregunta: string;
  respuesta: string;
}

@Injectable()
export class FichaService {
  private header = [];
  private header2 = [];

  constructor(
    @Inject('SEQUELIZE_SICP')
    private readonly sequelize: Sequelize
  ) {}

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
      await BackupRepository.guardarBackup(JSON.stringify(data));
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
      return await FichaJsonRepository.actualizarFichaJson(dataGrupalCard.id, {
        isFinish: dataGrupalCard.isFinish,
        version: dataGrupalCard.version,
        dateLastVersion: dataGrupalCard.dateLastVersion,
        grupalNombre: dataGrupalCard.grupalNombre,
        individualNombre: dataGrupalCard.individualNombre,
        grupalData: dataGrupalCard.grupalData,
        individualData: dataGrupalCard.individualData
      });
    } else {
      const maxVersion = await FichaJsonRepository.verUltimaVersion();
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

  public async buscarDinamicamente(
    filtros: IFiltrosBusqueda[],
    pagina: number = 1,
    registrosPorPagina: number = 10
  ) {
    try {
      return await FichaJsonRepository.buscarResultadosDinamicos(
        filtros,
        pagina,
        registrosPorPagina
      );
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

  public async obtenerEstadisticasPorCaracterizador(
    caracterizadorId?: number,
    fichaVersion?: number
  ) {
    try {
      return await FichaProcesadaRepository.obtenerEstadisticasPorCaracterizador(
        caracterizadorId,
        fichaVersion
      );
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  public async generarCSVFichasProcesadas(version: number) {
    const query = `
      WITH ficha_json_data AS (
        SELECT 
          jsonb_array_elements(grupal_data) as grupo_grupal,
          jsonb_array_elements(individual_data) as grupo_individual
        FROM ficha_json 
        WHERE version = :version
      ),
      headers AS (
        -- Obtener encabezados grupales
        SELECT 
          grupo_grupal->>'title' as grupo_titulo,
          jsonb_array_elements(grupo_grupal->'values') as valor
        FROM ficha_json_data
        UNION ALL
        -- Obtener encabezados individuales
        SELECT 
          grupo_individual->>'title' as grupo_titulo,
          jsonb_array_elements(grupo_individual->'values') as valor
        FROM ficha_json_data
      ),
      ficha_procesada_data AS (
        SELECT 
          fp.id,
          fp.codigo,
          fp.date_register,
          u.nombre_primero || ' ' || u.nombre_segundo || ' ' || u.apellido_primero || ' ' || u.apellido_segundo as caracterizador_nombre,
          u.documento as caracterizador_documento,
          jsonb_array_elements(fp.grupal_data) as grupo_grupal,
          jsonb_array_elements(fp.individual_data) as grupo_individual
        FROM ficha_procesada fp
        INNER JOIN "user" u ON u.id = fp.usuario_creacion_id
        WHERE fp.version = :version
      )
      SELECT 
        fp.id,
        fp.codigo,
        fp.date_register,
        fp.caracterizador_nombre,
        fp.caracterizador_documento,
        h.grupo_titulo,
        h.valor->>'label' as pregunta,
        h.valor->>'value' as respuesta
      FROM ficha_procesada_data fp
      CROSS JOIN headers h
      ORDER BY 
        fp.id,
        h.grupo_titulo,
        (h.valor->>'orden')::integer;
    `;

    const results = await this.sequelize.query<IResultadoCSV>(query, {
      replacements: { version },
      type: QueryTypes.SELECT
    });

    // Convertir los resultados a formato CSV
    const csvRows = [];

    // Agregar encabezados
    const headers = [
      'ID Ficha',
      'Código',
      'Fecha Registro',
      'Caracterizador',
      'Documento Caracterizador',
      'Grupo',
      'Pregunta',
      'Respuesta'
    ];
    csvRows.push(headers.join(','));

    // Agregar datos
    results.forEach(row => {
      const values = [
        row.id,
        row.codigo,
        row.date_register,
        `"${row.caracterizador_nombre}"`,
        row.caracterizador_documento,
        `"${row.grupo_titulo}"`,
        `"${row.pregunta}"`,
        `"${row.respuesta}"`
      ];
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  public async obtenerFormatoFichaJson(
    version: number,
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      this.header = this.header.concat(Array(7).fill('Caracterizador'));
      this.header2 = [
        'codigo',
        'primer nombre',
        'segundo nombre',
        'primer apellido',
        'segundo apellido',
        'documento'
      ];
      let datosUsuario: any;
      const fichaCsv = [];
      const encuestasProcesadas =
        await FichaRepository.obtenerEncuestasProcesadas(version);

      encuestasProcesadas.forEach(encuestaProcesada => {
        datosUsuario = this.extraerDatosUsuario(encuestaProcesada);
        const valoresGrupalData =
          this.formatearRegistro(encuestaProcesada).valoresGrupalData;
        const valoresIndividualData =
          this.formatearRegistro(encuestaProcesada).valoresIndividualData;

        const datosUsuarioFormateados = [
          { id: datosUsuario.id },
          { nombrePrimero: datosUsuario.nombrePrimero },
          { nombreSegundo: datosUsuario.nombreSegundo },
          { apellidoPrimero: datosUsuario.apellidoPrimero },
          { apellidoSegundo: datosUsuario.apellidoSegundo },
          { documento: datosUsuario.documento }
        ];

        fichaCsv.push([
          ...datosUsuarioFormateados,
          ...valoresGrupalData,
          ...valoresIndividualData
        ]);
      });

      return {
        header: this.header,
        headerlength: this.header.length,
        header2: this.header2,
        header2length: this.header2.length,
        fichaCsvlength: fichaCsv[0]?.length,
        fichaCsv
      };
    } catch (error) {
      console.error('Error al obtener formato de ficha:', error);
      throw error;
    }
  }

  private extraerDatosUsuario(encuestaProcesada: any): {
    id: number;
    nombrePrimero: string;
    nombreSegundo: string;
    apellidoPrimero: string;
    apellidoSegundo: string;
    documento: string;
  } {
    return {
      id: encuestaProcesada.usuarioCreacion.id,
      nombrePrimero: encuestaProcesada.usuarioCreacion.nombrePrimero,
      nombreSegundo: encuestaProcesada.usuarioCreacion.nombreSegundo,
      apellidoPrimero: encuestaProcesada.usuarioCreacion.apellidoPrimero,
      apellidoSegundo: encuestaProcesada.usuarioCreacion.apellidoSegundo,
      documento: encuestaProcesada.usuarioCreacion.documento
    };
  }

  private formatearRegistro(registro: {
    grupalData: ICategoria[];
    individualData: ICategoria[][];
  }): { valoresIndividualData: any; valoresGrupalData: any } {
    const valoresGrupalData = this.formatearCategorias(registro.grupalData);
    const valoresIndividualData = [];
    registro.individualData.forEach((registro: ICategoria[]) => {
      valoresIndividualData.push(...this.formatearCategorias(registro));
    });

    this.header = this.header.concat(
      Array(registro.grupalData.length).fill(registro.grupalData[0].title)
    );
    this.header = this.header.concat(
      Array(registro.individualData.length).fill(
        registro.individualData[0][0].title
      )
    );
    return { valoresIndividualData, valoresGrupalData };
  }

  private formatearCategorias(categorias: ICategoria[]) {
    const respuestas = [];
    categorias.forEach(categoria => {
      categoria.values.forEach(respuesta => {
        this.header2.push(respuesta.label);
        if (['select'].includes(respuesta.type)) {
          const option = respuesta.options.find(
            option => option.value === respuesta.value
          );
          const valor = {
            [respuesta.label]:
              respuesta.value === null
                ? ''
                : `${respuesta.value}-${option.option}`
          };
          respuestas.push(valor);
        } else {
          const valor = {
            [respuesta.label]: respuesta.value === null ? '' : respuesta.value
          };
          respuestas.push(valor);
        }
      });
    });
    return respuestas;
  }
}

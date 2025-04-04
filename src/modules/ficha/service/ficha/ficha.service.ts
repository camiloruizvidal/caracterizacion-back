import {
  ETipoGrupo,
  IFiltrosBusqueda
} from './../../../../utils/global.interface';
import { UsuarioRepository } from './../../../usuarios/repository/usuario.repository';
import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import {
  IFormulario,
  IAlerta,
  ICategoria,
  IOptionsSelect,
  IPregunta
} from '../../interface/ficha.interface';
import { IPagination } from 'src/utils/global.interface';
import { FichaGrupoRepository } from '../../repository/ficha-grupo.repository';
import { BackupRepository } from '../../repository/backup.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';
import { MapeoExcelRepository } from '../../repository/mapeo-excel.repository';
import { IFormatoMapeoExcel } from '../../interfaces/mapeo-excel.interface';
import { Sequelize } from 'sequelize-typescript';
import { FichaRepository } from '../../repository/ficha.repository';
import * as path from 'path';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
import { Config } from '../../../../config/config';
import { GeneracionExcelRepository } from '../../repository/generacion-excel.repository';
import { Request } from 'express';

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
    const ficha = await FichaJsonRepository.obtnerUltimaFichaActiva();
    if (!ficha || !ficha.id) {
      throw new HttpException(
        'No hay ficha activa disponible',
        HttpStatus.NOT_FOUND
      );
    }
    return ficha;
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
      if (!mapeo.fichaJsonId) {
        throw new Error('El ID de la ficha es requerido');
      }

      if (!mapeo.columnasExcel || mapeo.columnasExcel.length === 0) {
        throw new Error('Debe especificar al menos una columna de Excel');
      }

      if (!mapeo.mapeo || mapeo.mapeo.length === 0) {
        throw new Error('Debe especificar al menos un mapeo');
      }

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
      const mapeo = await MapeoExcelRepository.obtenerPorFicha(fichaJsonId);

      if (!mapeo) {
        throw new HttpException(
          'No se encontró el mapeo para la ficha especificada',
          HttpStatus.NOT_FOUND
        );
      }

      return {
        fichaJsonId: mapeo.ficha_json_id,
        columnasExcel: mapeo.columnas_excel,
        mapeo: mapeo.mapeo
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener los encabezados: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
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

  public async obtenerFormatoFichaJson(version: number, req: Request) {
    let progreso;
    try {
      console.log('Iniciando generación de archivo Excel...');
      const fecha = new Date().toISOString().replace(/[:.]/g, '');
      const nombreArchivo = `caracterizacion_${version}_${fecha}.xlsx`;
      console.log('Nombre del archivo:', nombreArchivo);

      const rutaRelativa = path.join(Config.DIRECTORIO_SALIDA, nombreArchivo);
      const rutaCompleta = path.join(
        Config.STORAGE_PATH,
        Config.FOLDER_PUBLIC_URL,
        rutaRelativa
      );
      console.log('Ruta completa del archivo:', rutaCompleta);

      const directorioSalida = path.join(
        Config.STORAGE_PATH,
        Config.FOLDER_PUBLIC_URL,
        Config.DIRECTORIO_SALIDA
      );
      console.log('Directorio de salida:', directorioSalida);

      if (!fs.existsSync(directorioSalida)) {
        console.log('Creando directorio de salida...');
        fs.mkdirSync(directorioSalida, { recursive: true });
      }

      const REGISTROS_POR_PAGINA = 100;
      const totalRegistros =
        await FichaRepository.contarRegistrosPorVersion(version);
      console.log('Total de registros:', totalRegistros);

      progreso = await GeneracionExcelRepository.crearProgreso(
        version,
        rutaRelativa,
        totalRegistros
      );

      // Retornar la URL inmediatamente
      const protocolo = req.protocol;
      const host = req.get('host');
      const dominio = `${protocolo}://${host}`;
      const rutaNormalizada = rutaRelativa.replace(/\\/g, '/');
      const url = `${dominio}/public/${rutaNormalizada}`;

      // Procesar el archivo en segundo plano
      this.procesarArchivoEnSegundoPlano(
        version,
        totalRegistros,
        rutaCompleta,
        progreso.id
      ).catch(error => {
        console.error('Error al procesar archivo en segundo plano:', error);
        GeneracionExcelRepository.marcarComoError(progreso.id, error.message);
      });

      return {
        code: HttpStatus.OK,
        msj: 'Archivo en proceso de generación',
        data: { url }
      };
    } catch (error) {
      console.error('Error detallado al obtener formato de ficha:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Error al obtener el formato de la ficha',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async procesarArchivoEnSegundoPlano(
    version: number,
    totalRegistros: number,
    rutaCompleta: string,
    progresoId: number
  ) {
    try {
      if (totalRegistros === 0) {
        console.log('No hay registros, generando Excel vacío...');
        const libroTrabajo = new ExcelJS.Workbook();
        await libroTrabajo.xlsx.writeFile(rutaCompleta);
        console.log('Excel vacío generado exitosamente');
        await GeneracionExcelRepository.marcarComoCompletado(progresoId);
        return;
      }

      const REGISTROS_POR_PAGINA = 100;
      const maxRegistrosIndividuales =
        await FichaRepository.obtenerMaxRegistrosPorVersion(version);
      console.log(
        'Máximo de registros individuales:',
        maxRegistrosIndividuales
      );

      const totalRegistrosReales =
        totalRegistros * (maxRegistrosIndividuales + 1);
      const totalPaginas = Math.ceil(
        totalRegistrosReales / REGISTROS_POR_PAGINA
      );
      console.log('Total de páginas a procesar:', totalPaginas);

      const resultadoFinal: string[][] = [];
      let registrosProcesados = 0;

      for (let pagina = 0; pagina < totalPaginas; pagina++) {
        console.log(`Procesando página ${pagina + 1} de ${totalPaginas}...`);
        const registrosNecesarios = Math.ceil(
          REGISTROS_POR_PAGINA / (maxRegistrosIndividuales + 1)
        );

        const encuestasProcesadas =
          await FichaRepository.obtenerEncuestasProcesadas(
            version,
            registrosNecesarios,
            pagina * registrosNecesarios
          );
        console.log(
          `Registros obtenidos en la página ${pagina + 1}:`,
          encuestasProcesadas.length
        );

        const resultados = encuestasProcesadas.map(encuesta =>
          this.procesarRegistroEncuesta(encuesta, maxRegistrosIndividuales)
        );

        if (pagina === 0 && resultados.length > 0) {
          resultadoFinal.push(...resultados[0]);
          console.log('Guardando encabezados y primera página...');
          await this.guardarArchivo(resultadoFinal, rutaCompleta, true);
        } else if (resultados.length > 0) {
          const valoresNuevos = resultados.map(resultado => resultado[2]);
          console.log('Guardando página adicional...');
          await this.guardarArchivo(valoresNuevos, rutaCompleta, false);
        }

        registrosProcesados += encuestasProcesadas.length;
        await GeneracionExcelRepository.actualizarProgreso(
          progresoId,
          registrosProcesados
        );
      }
      console.log('Archivo generado exitosamente');
      await GeneracionExcelRepository.marcarComoCompletado(progresoId);
    } catch (error) {
      console.error('Error al procesar archivo en segundo plano:', error);
      await GeneracionExcelRepository.marcarComoError(
        progresoId,
        error.message
      );
    }
  }

  private procesarRegistroEncuesta(
    registro: {
      grupalData: ICategoria[];
      individualData: ICategoria[][];
    },
    maxRegistrosIndividuales: number
  ): string[][] {
    const resultado: string[][] = [];
    const headersCategorias: string[] = [];
    const headersPreguntas: string[] = [];
    const valores: string[] = [];

    registro.grupalData.forEach(categoria => {
      categoria.values?.forEach(pregunta => {
        headersCategorias.push(categoria.title);
        headersPreguntas.push(pregunta.label);
        valores.push(this.formatearValores(pregunta));
      });
      headersCategorias.push(categoria.title);
      headersPreguntas.push('Planes de cuidado');
      valores.push(this.extraerPlanesCuidado(categoria));
    });

    const categoriaIndividual = registro.individualData[0] || [];
    categoriaIndividual.forEach(categoria => {
      for (let i = 0; i < maxRegistrosIndividuales; i++) {
        categoria.values?.forEach(pregunta => {
          headersCategorias.push(`${categoria.title} (Individual ${i + 1})`);
          headersPreguntas.push(pregunta.label);
        });
        headersCategorias.push(`${categoria.title} (Individual ${i + 1})`);
        headersPreguntas.push('Planes de cuidado');
      }
    });

    registro.individualData.forEach(categoriasIndividuo => {
      categoriasIndividuo.forEach(categoria => {
        categoria.values?.forEach(pregunta => {
          valores.push(this.formatearValores(pregunta));
        });
        valores.push(this.extraerPlanesCuidado(categoria));
      });
    });

    resultado.push(headersCategorias);
    resultado.push(headersPreguntas);
    resultado.push(valores);

    return resultado;
  }

  private extraerPlanesCuidado(categoria: ICategoria): string {
    if (categoria?.planes_cuidado) {
      return categoria.planes_cuidado
        .map((plan, indice) => `${indice + 1}) ${plan}`)
        .join('\n');
    }
    return '';
  }

  private formatearValores(pregunta: IPregunta): string {
    if (['select'].includes(pregunta.type)) {
      if (pregunta.value === null) {
        return '';
      }
      const opcion = pregunta.options.find(
        (opcion: IOptionsSelect) => opcion.value === pregunta.value
      );
      if (opcion) {
        return `${pregunta.value}-${opcion.option}`;
      }
      return pregunta.value;
    } else {
      return pregunta.value ?? '-';
    }
  }

  private async guardarArchivo(
    resultados: string[][],
    rutaArchivo: string,
    esHeader: boolean
  ) {
    if (!this.esStringArray(resultados)) {
      throw 'Formato inexperado string[][]';
    }

    try {
      const libroTrabajo = new ExcelJS.Workbook();
      const hojaTrabajo = libroTrabajo.addWorksheet('Hoja1');

      if (esHeader) {
        const encabezado = resultados[0];
        hojaTrabajo.addRow(encabezado);

        let columnaInicio = 1;
        let valorActual = encabezado[0];

        for (let i = 1; i <= encabezado.length; i++) {
          if (i === encabezado.length || encabezado[i] !== valorActual) {
            if (i - columnaInicio > 0) {
              hojaTrabajo.mergeCells(1, columnaInicio, 1, i);
              const celda = hojaTrabajo.getCell(1, columnaInicio);
              celda.alignment = { horizontal: 'center' };
              celda.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            }
            columnaInicio = i + 1;
            valorActual = encabezado[i];
          }
        }

        for (let i = 1; i < resultados.length; i++) {
          const fila = hojaTrabajo.addRow(resultados[i]);
          fila.eachCell(celda => {
            celda.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        }

        await libroTrabajo.xlsx.writeFile(rutaArchivo);
      } else {
        const archivoExiste = fs.existsSync(rutaArchivo);

        if (archivoExiste) {
          await libroTrabajo.xlsx.readFile(rutaArchivo);
          const hojaTrabajo = libroTrabajo.getWorksheet('Hoja1');
          resultados.forEach(datosFila => {
            const fila = hojaTrabajo.addRow(datosFila);
            fila.eachCell(celda => {
              celda.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });
          await libroTrabajo.xlsx.writeFile(rutaArchivo);
        } else {
          const hojaTrabajo = libroTrabajo.addWorksheet('Hoja1');
          resultados.forEach(datosFila => {
            const fila = hojaTrabajo.addRow(datosFila);
            fila.eachCell(celda => {
              celda.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });
          await libroTrabajo.xlsx.writeFile(rutaArchivo);
        }
      }
    } catch (error) {
      console.error('Error al guardar Excel:', error);
      throw error;
    }
  }

  private esStringArray(array: any): boolean {
    if (!Array.isArray(array)) return false;

    for (let i = 0; i < array.length; i++) {
      if (!Array.isArray(array[i])) {
        console.log({ array: array[i] });
        return false;
      }

      for (let j = 0; j < array[i].length; j++) {
        if (typeof array[i][j] !== 'string') {
          console.log({ type: typeof array[i][j], data: array[i][j] });
          return false;
        }
      }
    }

    return true;
  }

  public async obtenerRegistrosGeneracionExcel(
    page: number = 1,
    pageSize: number = 10,
    versionId?: number,
    req?: Request
  ) {
    try {
      const registros =
        await GeneracionExcelRepository.obtenerRegistrosPaginados(
          page,
          pageSize,
          versionId
        );

      // Normalizar las rutas y agregar el host
      const protocolo = req?.protocol || 'http';
      const host = req?.get('host') || 'localhost:3000';
      const dominio = `${protocolo}://${host}`;

      const registrosNormalizados = registros.data.map(registro => ({
        ...registro,
        rutaArchivo: registro.rutaArchivo
          ? `${dominio}/${Config.FOLDER_PUBLIC_URL}/${registro.rutaArchivo.replace(/\\/g, '/')}`
          : null
      }));

      return {
        code: HttpStatus.OK,
        msj: 'Registros obtenidos exitosamente',
        data: {
          ...registros,
          data: registrosNormalizados
        }
      };
    } catch (error) {
      console.error('Error al obtener registros de generación Excel:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Error al obtener los registros de generación Excel',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

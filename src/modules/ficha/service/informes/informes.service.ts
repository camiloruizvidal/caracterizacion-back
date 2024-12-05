import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IHeaderExcel } from '../../interface/ficha.interface';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { ExcelService } from 'src/utils/excel.service';
import { CacheService } from 'src/utils/cache.service';
import { EFileStatus } from 'src/utils/global.interface';

@Injectable()
export class InformesService {
  constructor(private readonly excelService: ExcelService) {}

  public async generarInformeDinamico(nombreArchivo: string): Promise<void> {
    await this.excelService.iniciarEscritura(nombreArchivo);
    const header: any[] = await this.generarHeader();

    this.excelService.agregarHeaderEscritura(header);

    const registrosXPagina = 500;
    let pagina = 1;
    let totalPaginas: number;

    do {
      const datos = await FichaProcesadaRepository.obtenerFichasProcesadas(
        pagina,
        registrosXPagina
      );

      const data = this.procesarBloque(datos.rows);
      await this.excelService.agregarDatosEscritura(data);

      if (!totalPaginas) {
        totalPaginas = Math.ceil(datos.totalRegistros / registrosXPagina);
      }

      pagina++;
    } while (pagina <= totalPaginas);

    this.excelService.finalizarEscritura();
  }

  private async generarHeader(): Promise<any[]> {
    const version = '1';
    const headers: any[] = [];
    const data = await FichaJsonRepository.obtenerXVersionFichaJson(version);

    const segundoHeader: any[] = [];

    const datosIniciales = [
      { value: 'Codigo', colSpan: 1 },
      { value: 'Caracterizador', colSpan: 2 },
      { value: 'Fechas', colSpan: 2 }
    ];

    segundoHeader.push('Numero');
    segundoHeader.push('Nombres');
    segundoHeader.push('apellidos');
    segundoHeader.push('Fecha de creacion');
    segundoHeader.push('Fecha de envio');

    const familyCard = data.familyCard.map(registro => {
      registro.values.forEach(reg => {
        segundoHeader.push(reg.label);
      });
      return { value: registro.title, colSpan: registro.values.length };
    }) as IHeaderExcel[];

    const personCard = data.personCard.map(registro => {
      registro.values.forEach(reg => {
        segundoHeader.push(reg.label);
      });
      return { value: registro.title, colSpan: registro.values.length };
    }) as IHeaderExcel[];

    headers.push([...datosIniciales, ...familyCard, ...personCard]);
    headers.push([...segundoHeader]);
    return headers;
  }

  private procesarBloque(rows: any[]): any[] {
    const resultados = [];

    rows.forEach(data => {
      const registrosAnnadidos = [];
      registrosAnnadidos.push(data.codigo.toString());
      registrosAnnadidos.push('Camilo');
      registrosAnnadidos.push('Ruiz');
      registrosAnnadidos.push(new Date(data.updated_at ?? null).toISOString());
      registrosAnnadidos.push(
        new Date(data.dateRegister ?? null).toISOString()
      );

      data.familyCard.forEach(element => {
        element.values.forEach(value => {
          registrosAnnadidos.push(value.value === null ? '-' : value.value);
        });
      });

      data.personCard.forEach(element => {
        element.forEach(value => {
          registrosAnnadidos.push(value.value === null ? '-' : value.value);
        });
      });

      resultados.push(registrosAnnadidos);
    });

    return resultados;
  }

  public verEstadoInformeDinamico(fileName: string) {
    const estado: EFileStatus = CacheService.getFileStatus(fileName);
    if (estado === EFileStatus.NOT_STARTED) {
      throw new HttpException(
        `"${fileName}" no se encuentra en el sistema.`,
        HttpStatus.NOT_FOUND
      );
    }
    return estado;
  }
}

import { EFileStatus } from './../../../../utils/global.interface';
import { IGrupalCardSave } from '../../interface/ficha.interface';
import { FichaService } from '../../service/ficha/ficha.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { InformesService } from '../../service/informes/informes.service';
import { Request, Response } from 'express';
import { Config } from 'src/Config/Config';
import { WordAPdfService } from 'src/utils/word-a-pdf.service';
import { VersionFichaDto } from '../../dto/version-ficha.dto';
import { obtenerGruposParamsDto } from '../../dto/obtener-grupos-params.dto';
import { FichaTipoParamDto } from '../../dto/ficha.tipo.param.dto';

@Controller('api/v1/ficha')
export class FichaController {
  constructor(
    private fichaService: FichaService,
    private informesService: InformesService,
    private wordAPdfService: WordAPdfService
  ) {}
  @Post('tipo')
  public async agregarTipo(@Body() respuesta: FichaTipoParamDto) {
    try {
      return this.fichaService.agregarTipoFicha(
        respuesta.versionFicha,
        respuesta.tipo,
        respuesta.titulo
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('formato_ficha')
  public async getFormatoFicha() {
    try {
      return {
        code: 200,
        msj: 'success',
        data: await this.fichaService.obternerFormatoFicha()
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          msj: error
        },
        HttpStatus.EXPECTATION_FAILED
      );
    }
  }

  @Post('save')
  public async guardarRegistro(@Body() dataGrupalCard: IGrupalCardSave) {
    try {
      const data = await this.fichaService.saveRegisterBackup(dataGrupalCard);
      return {
        status: 200,
        msj: 'success',
        data
      };
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Get('procesarTodas')
  public async procesarTodaslasFichasSubidas() {}

  @Get('informecompleto')
  public async generarInformes(@Req() req: Request, @Res() res: Response) {
    try {
      const protocolo = req.protocol;
      const host = req.get('host');
      const dominio = `${protocolo}://${host}`;
      const fileName = 'Caracterizacion' + new Date().getTime() + '.xlsx';
      res.send({
        fileName,
        url: `${dominio}/${Config.FOLDER_PUBLIC_URL}/${fileName}`
      });
      await this.informesService.generarInformeDinamico(fileName);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al generar el PDF. ' + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('informecompleto/:filename')
  public async verEstadoExcel(@Param('filename') filename: string) {
    try {
      const estado: EFileStatus =
        this.informesService.verEstadoInformeDinamico(filename);
      return { estado };
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Get('backup')
  public obtenerFichas(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    try {
      return this.fichaService.loadFormsPage(page, pageSize);
    } catch (error) {
      throw error;
    }
  }

  @Get('detalle')
  public async verFichasDetalle(
    @Query('fechaInicio') fechaInicio: string = '',
    @Query('fechaFin') fechaFin: string = '',
    @Query('usuarioId') usuarioId: string = '',
    @Query('municipio') municipio: string = '',
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    return await this.fichaService.loadFormsDetail({
      fechaInicio,
      fechaFin,
      usuarioId,
      municipio,
      page,
      pageSize
    });
  }

  @Get('obtener/grupos')
  public async obtenerGrupos(@Query() parametros: obtenerGruposParamsDto) {
    try {
      return await this.fichaService.obtenerGrupos(
        parametros.fichaId,
        parametros.tipo
      );
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Post('ficha/nueva')
  @HttpCode(204)
  public async nuevaFicha(@Body() dataGrupalCard: any) {
    try {
      await this.fichaService.agregarNuevoFormatoFicha(dataGrupalCard);
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Post('nueva_version')
  @HttpCode(204)
  public async nuevaVersionFicha(@Body() versionData: VersionFichaDto) {
    try {
      await this.fichaService.agregarNuevaVersion(versionData);
    } catch (error) {
      throw error;
    }
  }

  @Get('ficha/obtenerJson/:id')
  public async obtenerFichaJson(@Param('id') version: number) {
    try {
      return { data: await this.fichaService.obtenerFichaJson(version) };
    } catch (error) {
      return error;
    }
  }

  @Post('/ficha/grupo_nuevo')
  public async nuevoGrupo(@Body() data: any) {
    try {
      return {
        data: await this.fichaService.guardarNuevoGrupo(data)
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/procesar')
  public async procesarFichaDinamica() {
    try {
      await this.fichaService.procesarFicha();
      return {
        data: 'success'
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/versiones')
  public async obtenerVersionesFicha() {
    try {
      return await this.fichaService.obtenerVersiones();
    } catch (error) {
      throw error;
    }
  }

  @Get('todo')
  public async todo(@Req() request: Request) {
    try {
      const datos = {
        nombre: 'Camilo',
        apellido: 'Ruiz',
        edad: 30,
        fecha: '2024-12-05',
        productos: [
          { nombreProducto: 'Laptop', precio: 1200, cantidad: 1, total: 1200 },
          { nombreProducto: 'Mouse', precio: 25, cantidad: 2, total: 50 },
          { nombreProducto: 'Teclado', precio: 75, cantidad: 1, total: 75 }
        ],
        detalles: [
          { titulo: 'Garantía', descripcion: '12 meses' },
          { titulo: 'Entrega', descripcion: 'A domicilio' }
        ],
        activo: true
      };
      const nombreArchivo: string = `documento-${Date.now()}`;

      const pdfGenerado = await this.wordAPdfService.generarPdf(
        'ejemplo.docx',
        nombreArchivo,
        datos
      );

      const protocol = request.protocol;
      const host = request.headers.host;
      const fullHost = `${protocol}://${host}`;
      return {
        pdf: `${fullHost}/${Config.FOLDER_PUBLIC_URL}/${Config.FOLDER_FILES_TEMPORAL}/${pdfGenerado.nombreArchivo}`
      };
    } catch (error) {
      return error;
    }
  }
}

import { EFileStatus } from './../../../../utils/global.interface';
import { IFamilyCardSave } from '../../interface/ficha.interface';
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
<<<<<<< HEAD
import { WordAPdfService } from 'src/utils/word-a-pdf.service';
=======
import { WordToPdfService } from 'src/utils/word-to-pdf.service';
import * as path from 'path';
>>>>>>> 6e3d0e4525e1b3297dcf5b8c561fcea173baaa7b

@Controller('api/v1/ficha')
export class FichaController {
  constructor(
    private fichaService: FichaService,
    private informesService: InformesService,
<<<<<<< HEAD
    private wordAPdfService: WordAPdfService
=======
    private wordToPdfService: WordToPdfService
>>>>>>> 6e3d0e4525e1b3297dcf5b8c561fcea173baaa7b
  ) {}

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
  public async guardarRegistro(@Body() dataFamilyCard: IFamilyCardSave) {
    try {
      const data = await this.fichaService.saveRegisterBackup(dataFamilyCard);
      return {
        status: 200,
        msj: 'success',
        data
      };
    } catch (error) {
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
    return this.fichaService.loadFormsPage(page, pageSize);
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
  public async obtenerGrupos() {
    return await this.fichaService.obtenerGrupos();
  }

  @Post('ficha/nueva')
  @HttpCode(204)
  public async nuevaFicha(@Body() dataFamilyCard: any) {
    try {
      await this.fichaService.agregarNuevoFormatoFicha(dataFamilyCard);
    } catch (error) {
      throw error;
    }
  }

  @Get('ficha/obtenerJson/:id')
  public async obtenerFichaJson(@Param('id') id: number) {
    try {
      return { data: await this.fichaService.obtenerFichaJson(id) };
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
    await this.fichaService.procesarFicha();
    return {
      data: 'success'
    };
  }

  @Get('todo')
  public async todo() {
<<<<<<< HEAD
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
      return await this.wordAPdfService.generarPdf('ejemplo.docx', datos);
    } catch (error) {
      return error;
=======
    const word = path.resolve(
      path.join(
        Config.FOLDER_FILES_URL,
        Config.FOLDER_FILES_TEMPORAL,
        'ejemplo.docx'
      )
    );
    const pdf = path.resolve(
      path.join(
        Config.FOLDER_FILES_URL,
        Config.FOLDER_FILES_TEMPORAL,
        'ejemplo.pdf'
      )
    );
    try {
      const x = await this.wordToPdfService.convertir(word, pdf);
      return { x };
    } catch (error) {
      console.log({ error });
      return { error };
>>>>>>> 6e3d0e4525e1b3297dcf5b8c561fcea173baaa7b
    }
  }
}

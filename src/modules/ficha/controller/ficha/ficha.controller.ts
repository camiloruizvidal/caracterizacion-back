import { IFamilyCardSave } from '../../interface/ficha.interface';
import { FichaService } from '../../service/ficha/ficha.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { InformesService } from '../../service/informes/informes.service';
import { Response } from 'express';
import { FichaEntity } from '../../entity/ficha.entity';
import { FichaDescripcionEntity } from '../../entity/ficha-descripcion.entity';

@Controller('api/v1/ficha')
export class FichaController {
  constructor(
    private fichaService: FichaService,
    private informesService: InformesService
  ) {}

  @Get('formato_ficha')
  public async getFormatoFicha() {
    try {
      return {
        code: 200,
        msj: 'success',
        data: await this.fichaService.obtenerFichaJson(2) //getFichaFormat()
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

  @Get('procesar')
  public async procesarFichasSubidasConUltimaVersion() {
    try {
      const data =
        await this.fichaService.procesarFichasSubidasConUltimaVersion();
      return {
        status: 200,
        msj:
          'Solo se procesan las fichas que tengan la última version: ' +
          data.id.toString(),
        data
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Get('informecompleto')
  public async generarInformes(@Res() res: Response) {
    try {
      const informe = await this.informesService.generarInformes();
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=exported-data.xlsx'
      );

      res.send(informe);
    } catch (error) {
      throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
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

  @Get(':id')
  public async obtenerFichaPorId(
    @Param('id') id: number
  ): Promise<{ ficha: FichaEntity; descripcion: FichaDescripcionEntity[] }> {
    return await this.fichaService.loadFormDetail(id);
  }

  @Get('obtener/grupos')
  public async obtenerGrupos() {
    return await this.fichaService.getGroups();
  }

  @Post('ficha/nueva')
  public async nuevaFicha(@Body() dataFamilyCard: any) {
    return {
      response: await this.fichaService.nuevoFormatoFicha(dataFamilyCard)
    };
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
    return {
      data: await this.fichaService.nuevoGrupo(data)
    };
  }
}

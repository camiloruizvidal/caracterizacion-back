import { IFamilyCardSave } from '../../interface/ficha.interface';
import { FichaService } from '../../service/ficha/ficha.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common';

@Controller('api/v1/ficha')
export class FichaController {
  constructor(private fichaService: FichaService) {}

  @Get('formato_ficha')
  public async getFormatoFicha() {
    try {
      return {
        code: 200,
        msj: 'success',
        data: await this.fichaService.getFichaFormat()
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
      console.log({ data });
      return {
        status: 200,
        msj: 'Solo se procesan las fichas que tengan la última version',
        data
      };
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
}

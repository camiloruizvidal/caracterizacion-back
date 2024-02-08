import { IFamilyCardSave } from '../../interface/ficha.interface';
import { FichaService } from '../../service/ficha/ficha.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post
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
  public async guardarRegistro(@Body() data: IFamilyCardSave) {
    try {
      const ran = Math.floor(Math.random() * 2) + 1;
      console.log({ran})
      if (ran === 1) {
        throw 'jajajajajaja';
      }
      return {
        code: 200,
        msj: 'success',
        data: { save: await this.fichaService.saveRegisterBackup(data) }
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
}

import { FichaService } from '../../service/ficha/ficha.service';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('api/v1/ficha')
export class FichaController {
  constructor(private fichaService: FichaService) {}

  @Get('formato_ficha')
  public async getFormatoFicha() {
    const ficha = await this.fichaService.getFichaFormat();

    try {
      return {
        code: 200,
        msj: 'success',
        data: ficha
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

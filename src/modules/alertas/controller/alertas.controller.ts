import { Body, Controller, Get } from '@nestjs/common';

@Controller('api/v1/alertas')
export class AlertasController {
  @Get('')
  public async verAlertas(@Body() respuesta: any) {
    console.log({ respuesta });
  }
}

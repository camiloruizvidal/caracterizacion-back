import { AlertasService } from './../service/alertas.service';
import { Body, Controller, Get } from '@nestjs/common';

@Controller('api/v1/alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get('')
  public async verAlertas(@Body() respuesta: any) {
    return await this.alertasService.obtenerAlertas();
  }
}

import { DataService } from '../../services/data/data.service';
import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('municipios')
  public async getMunicipalities() {
    return await this.dataService.getMunicipalities();
  }

  @Get('caracterizadores')
  public async getCaracterizadores() {
    return await this.dataService.getCaracterizadores();
  }
}

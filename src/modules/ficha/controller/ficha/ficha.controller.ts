import { FichaService } from '../../service/ficha/ficha.service';
import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/ficha')
export class FichaController {

    constructor(private fichaService: FichaService) {}

    @Get('formato_ficha')
    public async getFormatoFicha() {
        try {
            return await this.fichaService.getFichaFormat();
        } catch (error) {
            console.log({error})
        }
    }
}

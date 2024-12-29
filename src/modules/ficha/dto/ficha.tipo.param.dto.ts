import { ETipoGrupo } from './../../../utils/global.interface';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class FichaTipoParamDto {
  @Expose({ name: 'version_ficha' })
  @IsNumber()
  versionFicha: number;

  @Expose({ name: 'tipo' })
  @IsEnum(ETipoGrupo)
  tipo: ETipoGrupo;

  @IsString()
  titulo: string;
}

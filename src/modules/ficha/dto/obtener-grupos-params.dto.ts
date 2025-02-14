import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

enum ETipoGrupo {
  GRUPAL = 'grupal_data',
  INDIVIDUAL = 'individual_data'
}

export class obtenerGruposParamsDto {
  @Expose({ name: 'ficha_id' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'fichaId debe ser un número entero válido' })
  fichaId: number;

  @Expose({ name: 'tipo' })
  @IsEnum(ETipoGrupo)
  tipo: ETipoGrupo;
}

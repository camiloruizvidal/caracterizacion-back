import { Expose, Type } from 'class-transformer';
import { UsuarioDto } from './usuario.dto';

export class UsuariosPaginadosDto {
  @Expose({ name: 'rows' })
  @Type(() => UsuarioDto)
  data: UsuarioDto[];

  @Expose({ name: 'count' })
  totalItems: number;

  @Expose()
  currentPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  itemsPerPage: number;
}

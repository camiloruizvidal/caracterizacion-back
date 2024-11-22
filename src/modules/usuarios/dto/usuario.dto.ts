import { Expose, Type } from 'class-transformer';
import { RolesDto } from './roles.dto';

export class UsuarioDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  nombrePrimero: string;

  @Expose()
  nombreSegundo: string | null;

  @Expose()
  apellidoPrimero: string;

  @Expose()
  apellidoSegundo: string | null;

  @Expose()
  documento: string;

  @Expose()
  documentoTipoId: number;

  @Expose()
  rolId: number;

  @Expose()
  inactivo: boolean;

  @Expose()
  @Type(() => RolesDto)
  roles: RolesDto;
}

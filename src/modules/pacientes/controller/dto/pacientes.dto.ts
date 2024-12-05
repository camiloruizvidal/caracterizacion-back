import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PacienteDto {
  @ApiProperty()
  @Expose({ name: 'id' })
  id: number;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'documentoTipo' })
  documento_tipo: string | null;

  @ApiProperty()
  @Expose({ name: 'documentoNumero' })
  documento_numero: string;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'genero' })
  genero: string | null;

  @ApiProperty()
  @Expose({ name: 'nombrePrimero' })
  nombre_primero: string;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'nombreSegundo' })
  nombre_segundo: string | null;

  @ApiProperty()
  @Expose({ name: 'apellidoPrimero' })
  apellido_primero: string;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'apellidoSegundo' })
  apellido_segundo: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'fechaNacimiento' })
  fecha_nacimiento: Date | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'estadoCivil' })
  estado_civil: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'parentesco' })
  parentesco: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'ocupacion' })
  ocupacion: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'aportaIngresos' })
  aporta_ingresos: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'nivelEscolaridad' })
  nivel_escolaridad: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'tipoAfiliacionSalud' })
  tipo_afiliacion_salud: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'grupoAtencionEspecial' })
  grupo_atencion_especial: string | null;

  @ApiProperty({ nullable: true })
  @Expose({ name: 'discapacidad' })
  discapacidad: string | null;

  @ApiProperty()
  @Expose({ name: 'createdAt' })
  created_at: Date;

  @ApiProperty()
  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum PrefijoEnum {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PA = 'PA',
  RC = 'RC'
}

enum TipoDocumentoEnum {
  CEDULA_CIUDADANIA = 'Cédula de Ciudadanía',
  TARJETA_IDENTIDAD = 'Tarjeta de Identidad',
  CEDULA_EXTRANJERIA = 'Cédula de Extranjería',
  PASAPORTE = 'Pasaporte',
  REGISTRO_CIVIL = 'Registro Civil'
}

@Entity({ name: 'documento_tipo' })
export class DocumentTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PrefijoEnum, default: PrefijoEnum.CC })
  prefijo: PrefijoEnum;

  @Column({
    type: 'enum',
    enum: TipoDocumentoEnum,
    default: TipoDocumentoEnum.CEDULA_CIUDADANIA,
    name: 'tipoDocumento'
  })
  tipoDocumento: TipoDocumentoEnum;

  @Column()
  nombre: string;
}

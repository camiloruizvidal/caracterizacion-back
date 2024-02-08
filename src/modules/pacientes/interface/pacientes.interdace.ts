export interface IPacienteImportExcel {
  documento: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento?: Date;
  sexo?: string;
  parentesco?: string;
  ocupacion?: string;
  aporta_ingresos?: string;
  nivel_escolaridad?: string;
  afilicion_salud_tipo?: string;
  grupo_atencion_especial?: string;
  discapacidad?: string;
}

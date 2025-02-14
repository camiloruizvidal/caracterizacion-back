export type TipoDataForm = 'grupalData' | 'individualData';
export interface ISearchPagination {
  page: number;
  pageSize: number;
}

export interface IPagination<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export enum ETables {
  PACIENTE = 'pacientes',
  TARJETA_FAMILIAR = 'tarjeta_familiar',
  PSICOSOCIAL_PERSONA = 'psicosocial_persona'
}

export enum EFileStatus {
  NOT_STARTED = 'Invalido',
  IN_PROGRESS = 'Procesando',
  COMPLETED = 'Completo'
}

export enum IStatus {
  Almacenado = 'almacenado',
  Fallo = 'fallo',
  Guardado = 'guardado'
}

export enum ETipoGrupo {
  GRUPAL = 'grupalData',
  INDIVIDUAL = 'individualData'
}

export interface IFiltrosBusqueda {
  tipoTarjeta: TipoDataForm;
  grupo: string;
  pregunta: string;
  condicion: EConditions;
  valor: string;
}

export enum EConditions {
  MAYOR_QUE = '>',
  MAYOR_O_IGUAL_QUE = '>=',
  MENOR_QUE = '<',
  MENOR_O_IGUAL_QUE = '<=',
  IGUAL_QUE = '===',
  DIFERENTE_QUE = '!==',
  VACIO = 'null',
  RANGO_FECHA = 'rangoFecha'
}

export interface ICondiciones {
  text: string;
  condition: string;
}

export const condiciones: ICondiciones[] = [
  { condition: EConditions.MAYOR_QUE, text: 'Mayor que' },
  { condition: EConditions.MAYOR_O_IGUAL_QUE, text: 'Mayor O igual que' },
  { condition: EConditions.MENOR_QUE, text: 'Menor que' },
  { condition: EConditions.MENOR_O_IGUAL_QUE, text: 'Menor O Igual que' },
  { condition: EConditions.IGUAL_QUE, text: 'Igual que' },
  { condition: EConditions.DIFERENTE_QUE, text: 'Diferente que' },
  { condition: EConditions.VACIO, text: 'Vacio' },
  { condition: EConditions.RANGO_FECHA, text: 'Rango de fechas' }
];

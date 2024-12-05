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

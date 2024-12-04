export interface ISearchPagination {
  page: number;
  pageSize: number;
}

export interface IPaginationResult {
  data: any;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
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
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

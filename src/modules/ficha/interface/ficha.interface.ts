export interface IFormulario {
  isFinish: boolean;
  version?: string;
  dateLastVersion?: Date;
  grupalNombre: string;
  individualNombre: string;
  grupalData: ICategoria[];
  individualData: ICategoria[];
  alertaGrupal: IOptionsVisibilityExtended[];
  alertaIndividual: IOptionsVisibilityExtended[];
}

export interface ICategoria {
  id?: number | string;
  orden?: number;
  title: string;
  subtitle?: string | null;
  table?: string;
  ficha_tipo_id?: string | number;
  values?: IPregunta[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  alerta?: IConfiguracionAlertaCategoria;
  planes_cuidado?: string[];
}

export interface IPregunta {
  id?: number;
  columnName?: string;
  orden?: number;
  label: string;
  description?: string | null;
  type: ETipoPregunta | string;
  options?:
    | IOptionsCheck
    | IOptionsSelect[]
    | IOptionsSelectFilter
    | IOptionsSelectDependient //Para selectDependiente
    | null
    | any;
  default: boolean | string | null;
  visibility: IOptionsVisibility | boolean | null;
  required: IOptionsRequired | boolean | null;
  value?: any;
  ficha_grupo_id?: string | number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  nombrePadreDependiente?: string; //Para selectDependiente
  alerta?: IAlertaConfig;
}

export enum ETipoPregunta {
  Address = 'address',
  Calendar = 'calendar',
  Photo = 'photo',
  Check = 'check',
  CheckSiNo = 'checkSiNo',
  Email = 'email',
  Filter = 'filter',
  GPS = 'gps',
  Numbers = 'numbers',
  Phone = 'phone',
  Relationship = 'relationship',
  Select = 'select',
  SelectFilter = 'selectFilter',
  SelectDependiente = 'selectDependiente',
  Text = 'text',
  TextArea = 'textarea',
  Title = 'title',
  SubTitle = 'subtitle',
  Ruta = 'ruta_atencion',
  SelectMultiple = 'select_multiple'
}

export interface IOptionsCheck {
  valueTrue: string;
  valueFalse: string;
}

export interface IOptionsSelectDependient {
  show: { table: string; dependiente: string };
  value: string;
  option: string;
}

export interface IOptionsSelect {
  value: string;
  option: any;
}

export interface IOptionsRequired {
  isDepend: boolean;
  rules: any;
  required: boolean;
}

export interface IOptionsVisibility {
  isDepent: boolean;
  rules: IOptionsRule[] | null;
  isShow: boolean;
}

export interface IOptionsVisibilityExtended extends IOptionsRule {
  indice: number;
  labelCondition: string;
  labelField: string;
  labelValue?: string;
  alertaId: number;
  tipoAlerta: tipoAlertas;
}

export interface IOptionsRule {
  columnDepend: string;
  rule: EConditions;
  value: string | string[];
}

export interface ICodigos {
  id?: number;
  user_id?: number;
  start: number;
  finish: number;
}

export interface IOptionsSelectFilter {
  label: string;
  tabla_destino: string;
  item_busqueda: string;
  relaciones: IOptionsSelectFilterRelaciones[];
  formato_listado_mostrar: string;
  create_new: boolean;
  label_no_exist?: string;
}

export interface IOptionsSelectFilterRelaciones {
  origen: string;
  destino: string;
}

export type tipoAlertas = 'individual' | 'grupal';
export type TipoForm = 'grupalNombre' | 'individualNombre';
export type TipoDataForm = 'grupalData' | 'individualData';

export enum EConditions {
  MAYOR_QUE = '>',
  MAYOR_O_IGUAL_QUE = '>=',
  MENOR_QUE = '<',
  MENOR_O_IGUAL_QUE = '<=',
  IGUAL_QUE = '=',
  DIFERENTE_QUE = '!==',
  VACIO = 'null',
  RANGO_FECHA = 'rangoFecha',
  OR = 'OR'
}

// Interfaces específicas del backend que no existen en el frontend
export interface IGuardarFormularioGrupal {
  version: string;
  dateLastVersion: Date;
  dateRegister?: Date;
  code: number;
  userId?: number;
  data: IDatosFormularioGrupal;
}

export interface IDatosFormularioGrupal {
  grupalNombre: ICategoria[];
  individualNombre: ICategoria[][];
}

export interface IValorColumna {
  columnName: string;
  value: any;
  isValid?: boolean;
}

export interface IEncabezadoExcel {
  value: string;
  colSpan: number;
}

export interface IConfiguracionAlertaCategoria {
  genera_alerta: boolean;
  clasificaciones: IClasificacionAlerta[];
  nivel_calculado?: number;
  planes_cuidado?: string[];
}

export interface IClasificacionAlerta {
  nombre: string;
  rango_minimo: number;
  rango_maximo: number;
  color: string;
  planes_cuidado?: string[];
}

export interface IAlertaConfig {
  genera_alerta: boolean;
  valores_alerta?: {
    [key: string]: {
      valor: number;
      planes_cuidado?: string[];
    };
  };
  peso?: number;
}

export interface IAlertaClasificacion {
  nombre: string;
  rango_minimo: number;
  rango_maximo: number;
  color: string;
}

export interface IAlerta {
  genera_alerta: boolean;
  clasificaciones: IAlertaClasificacion[];
}

export interface IGruposFicha {
  id: number;
  title: string;
  subtitle?: string | null;
  orden: number;
  ficha_tipo_id?: number;
}

export interface ITarjetaRespondidas {
  id: number;
  codigo: number;
  date_register: string;
  nombre_primero: string;
  nombre_segundo: string | null;
  apellido_primero: string;
  apellido_segundo: string | null;
  documento: string;
  grupaldata: ICategoria[];
  individualdata: ICategoria[];
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
  { condition: EConditions.RANGO_FECHA, text: 'Rango de fechas' },
  { condition: EConditions.OR, text: 'OR' }
];

export interface IFiltrosBusqueda {
  tipoTarjeta: TipoDataForm;
  grupo: string;
  pregunta: string;
  condicion: EConditions;
  valor: string;
}

export interface ICondition {
  campo: string;
  operador: EConditions;
  valor: string;
}

export interface IAlertas {
  id: number | string;
  nombre: string;
  alerta_tipo_id?: number;
  color: string;
  rango_maximo: number;
  rango_minimo: number;
}

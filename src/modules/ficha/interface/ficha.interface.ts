export interface IFormulario {
  version: string;
  dateLastVersion: Date;
  grupalNombre: ICategoria[];
  individualNombre: ICategoria[];
}

export interface ICategoria {
  title: string;
  subtitle?: string;
  table: string;
  values: IPregunta[];
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
  selectMultiple = 'select_multiple'
}

export interface IOptionsCheck {
  valueTrue: string;
  valueFalse: string;
}

export interface IOptionsSelectDependient {
  valueDependiente: string;
  value: string;
  option: string;
}

export interface IOptionsSelect {
  value: string;
  option: string;
}

export interface IOptionsRequired {
  isDepend: boolean;
  rules: null;
  required: boolean;
}

export interface IOptionsVisibility {
  isDepent: boolean;
  rules: Array<IOptionsRule[]> | null;
  isShow: boolean;
}

export interface IOptionsRule {
  columnDepend: string;
  rule: string;
  value: string;
}
export interface ICodigos {
  id?: number;
  user_id?: number;
  start: number;
  finish: number;
}
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

export interface IEncabezadoExcel {
  value: string;
  colSpan: number;
}

export interface IAlertaConfig {
  genera_alerta: boolean;
  valores_alerta?: {
    [key: string]: number; // {"1": 3, "2": 2, "3": 1}
  };
  peso?: number; // Por si algunas preguntas pesan más que otras en el cálculo
}

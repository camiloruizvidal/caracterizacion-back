export interface IFichaCard {
  version: string;
  dateLastVersion: Date;
  grupalNombre: IStepers[];
  individualNombre: IStepers[];
}

export interface IStepers {
  title: string;
  subtitle?: string;
  table: string;
  values: ISteperValues[];
}

export interface ISteperValues {
  id?: number;
  columnName?: string;
  orden?: number;
  label: string;
  description?: string | null;
  type: ESteperType | string;
  options: IOptionsCheck | IOptionsSelect[] | IOptionsSelectFilter | null | any;
  default: boolean | string | null;
  visibility: IOptionsVisibility | boolean | null;
  required: IOptionsRequired | boolean | null;
  value?: any;
  ficha_grupo_id?: string | number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  nombrePadre?: string; //Para selectDependiente
}

export enum ESteperType {
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
export interface ICodes {
  id?: number;
  user_id?: number;
  start: number;
  finish: number;
}
export interface IGrupalCardSave {
  version: string;
  dateLastVersion: Date;
  dateRegister?: Date;
  code: number;
  userId?: number;
  data: IDataGrupalCard;
}
export interface IDataGrupalCard {
  grupalNombre: IStepers[];
  individualNombre: IStepers[][];
}

export interface IValueColumn {
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

export interface IHeaderExcel {
  value: string;
  colSpan: number;
}

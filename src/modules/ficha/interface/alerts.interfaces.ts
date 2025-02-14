import { EConditions } from 'src/utils/global.interface';

export interface ICondition {
  campo: string;
  operador: EConditions;
  valor: string;
}

export interface IAction {
  tipo: 'mensaje' | 'recomendacion';
  contenido: string;
}

export interface IAlert {
  id: string;
  titulo: string;
  descripcion: string;
  condiciones: ICondition[];
  acciones: IAction[];
}

export interface IAlertsSchema {
  alertas: IAlert[];
}

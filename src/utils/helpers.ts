export class JsonTransformer {
  to(value: any): string {
    return JSON.stringify(value);
  }

  from(value: string): any {
    return JSON.parse(value);
  }
}

export class Transformadores {
  /**
   * Método para extraer dataValues de un objeto Sequelize o cualquier JSON anidado.
   * Procesa recursivamente las relaciones.
   * @param result Objeto, lista o resultado paginado.
   * @returns Un objeto limpio con solo los datos.
   */
  static extraerDataValues(result: any): any {
    if (!result) {
      return result;
    }

    if (Array.isArray(result)) {
      // Si es un array, procesa recursivamente cada elemento.
      return result.map(item => Transformadores.extraerDataValues(item));
    }

    if (result.rows) {
      // Si es un resultado paginado (findAndCountAll), procesa las filas.
      return {
        ...result,
        rows: result.rows.map(item => Transformadores.extraerDataValues(item))
      };
    }

    // Si tiene dataValues, extrae los datos y procesa recursivamente las propiedades.
    if (result?.dataValues) {
      const data = { ...result.dataValues };
      for (const key in data) {
        if (data[key] && typeof data[key] === 'object') {
          data[key] = Transformadores.extraerDataValues(data[key]);
        }
      }
      return data;
    }

    // Si es un objeto genérico, procesa sus propiedades recursivamente.
    if (typeof result === 'object' && result !== null) {
      const data = { ...result };
      for (const key in data) {
        if (data[key] && typeof data[key] === 'object') {
          data[key] = Transformadores.extraerDataValues(data[key]);
        }
      }
      return data;
    }

    // Devuelve el valor tal cual si no es un objeto o array.
    return result;
  }
}

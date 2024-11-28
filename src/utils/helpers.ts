export class JsonTransformer {
  to(value: any): string {
    return JSON.stringify(value);
  }

  from(value: string): any {
    return JSON.parse(value);
  }
}

export class Transformadores {
  static extraerDataValues(result: any): any {
    if (
      !result ||
      (Array.isArray(result) && result.length === 0) ||
      (result.rows && result.rows.length === 0)
    ) {
      return null;
    }

    if (Array.isArray(result)) {
      return result.map(item => Transformadores.extraerDataValues(item));
    }

    if (result.rows) {
      return {
        ...result,
        rows: result.rows.map(item => Transformadores.extraerDataValues(item))
      };
    }

    if (result?.dataValues) {
      const data = { ...result.dataValues };
      for (const key in data) {
        if (data[key]) {
          if (typeof data[key] === 'object' && !(data[key] instanceof Date)) {
            console.log({ key, data: data[key] });
            data[key] = Transformadores.extraerDataValues(data[key]);
          }
        }
      }
      return data;
    }

    if (typeof result === 'object' && result !== null) {
      const data = { ...result };
      for (const key in data) {
        if (data[key] && typeof data[key] === 'object') {
          data[key] = Transformadores.extraerDataValues(data[key]);
        }
      }
      return data;
    }

    return result;
  }
}

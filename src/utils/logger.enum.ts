import { LogLevel } from '@nestjs/common/services/logger.service';

export function obtenerNivelesLog(esProduccion: boolean): LogLevel[] {
  if (esProduccion) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}

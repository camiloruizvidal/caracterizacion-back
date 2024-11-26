import { ValidationError } from 'class-validator';
import { Constantes } from './constantes';

export function formatearErroresValidacion(
  errores: ValidationError[]
): string[] {
  const mensajesValidaciones: string[] = [];

  errores.forEach(error => {
    // Cuando existan propiedades adicionales no permitidas, cambiamos el mensaje
    // de validación por defecto a español
    if (error.constraints?.whitelistValidation) {
      error.constraints.whitelistValidation = Constantes.PROPIEDAD_NO_PERMITIDA(
        error.property
      );
    }
    // Revisamos también aquellas validaciones que estan anidadas
    if (error.children && error.children.length > 0) {
      mensajesValidaciones.push(...formatearErroresValidacion(error.children));
    } else {
      const constraints = Object.values(error.constraints);
      mensajesValidaciones.push(...constraints);
    }
  });
  return mensajesValidaciones;
}

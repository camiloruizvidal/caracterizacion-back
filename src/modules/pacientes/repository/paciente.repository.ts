import { Paciente } from '../model/paciente.model';

export class PacienteRepository {
  public static async guardarPacientesBulk(pacientes: any[]) {
    try {
      return await Paciente.bulkCreate(pacientes, {
        updateOnDuplicate: [
          'documentoTipo',
          'nombrePrimero',
          'nombreSegundo',
          'apellidoPrimero',
          'apellidoSegundo',
          'fechaNacimiento',
          'genero',
          'estadoCivil',
          'parentesco',
          'ocupacion',
          'aportaIngresos',
          'nivelEscolaridad',
          'tipoAfiliacionSalud',
          'grupoAtencionEspecial'
        ]
      });
    } catch (error) {
      console.error('Error al guardar o actualizar pacientes:', error);
      throw error;
    }
  }
}

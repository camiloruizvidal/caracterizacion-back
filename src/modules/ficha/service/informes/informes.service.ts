import { FichaDescripcionEntity } from '../../entity/ficha-descripcion.entity';
import { PsicosocialPersonaEntity } from '../../entity/psicosocial-persona.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';

@Injectable()
export class InformesService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(PsicosocialPersonaEntity)
    private readonly psicosocialPersonaRepository: Repository<PsicosocialPersonaEntity>,
    @InjectRepository(FichaDescripcionEntity)
    private readonly fichaDescripcionEntityRepository: Repository<FichaDescripcionEntity>
  ) {}

  public async generarInformes() {
    return await this.verInforme();
  }
  private async verInforme() {
    try {
      const informe: any[] = await this.findAllForms();
      const fichaDescripcion: any[] = await this.findAllFormsDescription();
      const mapearItem = informeItem => {
        const resultadoItem = {};

        for (const key in informeItem) {
          const descripcion = fichaDescripcion.find(
            desc => desc.columnName === key
          );

          if (descripcion) {
            resultadoItem[descripcion.label] = informeItem[key];
          } else {
            resultadoItem[key] = informeItem[key];
          }
        }

        return resultadoItem;
      };
      return await this.exportToExcel(informe.map(mapearItem));
    } catch (error) {
      throw error;
    }
  }

  private async findAllForms(): Promise<any[]> {
    const query = `SELECT
                      "public"."ficha"."codigo",              
                      "public"."ficha"."fecha_registro" as "Fecha de creacion",
                      "public"."ficha"."created_at" as "Fecha de subida",
                      concat_ws(' ',
                        "public"."user"."nombre_primero",
                        "public"."user"."nombre_segundo",
                        "public"."user"."apellido_primero",
                        "public"."user"."apellido_segundo"
                      ) as caracterizador,
                      "public"."user"."documento",
                      "public"."tarjeta_familiar"."direccion",
                      "public"."tarjeta_familiar"."barrio",
                      "public"."tarjeta_familiar"."municipio",
                      "public"."tarjeta_familiar"."telefono",
                      "public"."tarjeta_familiar"."participa_organizacion_comunitaria",
                      "public"."tarjeta_familiar"."participa_organizacion_comunitaria_si",
                      "public"."tarjeta_familiar"."cuantas_personas_residen_en_la_vivienda",
                      "public"."tarjeta_familiar"."cuantas_familias_residen_en_esta_vivienda",
                      "public"."tarjeta_familiar"."ubicacion_gps",
                      "public"."tarjeta_familiar"."tipo_vivienda",
                      "public"."tarjeta_familiar"."tipo_vivienda_valor_arriendo",
                      "public"."tarjeta_familiar"."tipo_vivienda_otro",
                      "public"."tarjeta_familiar"."lote_legalizado",
                      "public"."tarjeta_familiar"."estrato_vivienda",
                      "public"."tarjeta_familiar"."trabajo_en_casa",
                      "public"."tarjeta_familiar"."trabajo_en_casa_cual",
                      "public"."tarjeta_familiar"."ingresos_mensuales_familia",
                      "public"."tarjeta_familiar"."gastos_servicios_publicos",
                      "public"."tarjeta_familiar"."acceso_facil_vivienda",
                      "public"."tarjeta_familiar"."desplazamiento_escuela_centro_estudio",
                      "public"."tarjeta_familiar"."tiempo_promedio_desplazamiento_escuela",
                      "public"."tarjeta_familiar"."desplazamiento_trabajo",
                      "public"."tarjeta_familiar"."tiempo_promedio_desplazamiento_trabajo",
                      "public"."tarjeta_familiar"."desplazamiento_salud",
                      "public"."tarjeta_familiar"."tiempo_promedio_desplazamiento_salud",
                      "public"."tarjeta_familiar"."cocina_sitio_preparar_alimentos",
                      "public"."tarjeta_familiar"."combustible_cocinar",
                      "public"."tarjeta_familiar"."servicios_basicos_vivienda",
                      "public"."tarjeta_familiar"."conformidad_servicios",
                      "public"."tarjeta_familiar"."por_que_no_conformidad",
                      "public"."tarjeta_familiar"."origen_agua_consumo",
                      "public"."tarjeta_familiar"."origen_agua_consumo_otro",
                      "public"."tarjeta_familiar"."regularidad_obtencion_agua",
                      "public"."tarjeta_familiar"."almacenamiento_agua",
                      "public"."tarjeta_familiar"."frecuencia_lavado_tanque_recipiente",
                      "public"."tarjeta_familiar"."ubicacion_tanque_recipiente",
                      "public"."tarjeta_familiar"."tratamiento_agua",
                      "public"."tarjeta_familiar"."tratamiento_agua_tiempo_hervir_agua",
                      "public"."tarjeta_familiar"."tratamiento_agua_otro",
                      "public"."tarjeta_familiar"."servicio_sanitario",
                      "public"."tarjeta_familiar"."disposicion_final_basuras",
                      "public"."tarjeta_familiar"."disposicion_final_basuras_otro",
                      "public"."tarjeta_familiar"."separacion_residuos_reciclaje",
                      "public"."tarjeta_familiar"."proteccion_contra_animales_plagas_vectores",
                      "public"."tarjeta_familiar"."proteccion_contra_animales_plagas_vectores_otros",
                      "public"."tarjeta_familiar"."guardado_ropa_vivienda",
                      "public"."tarjeta_familiar"."guardado_ropa_vivienda_otro",
                      "public"."tarjeta_familiar"."guardado_individual_ropa",
                      "public"."tarjeta_familiar"."aseo_en_vivienda",
                      "public"."tarjeta_familiar"."aseo_en_vivienda_otro",
                      "public"."tarjeta_familiar"."uso_detergentes_desinfectantes_aseo",
                      "public"."tarjeta_familiar"."uso_final_plaguicidas",
                      "public"."tarjeta_familiar"."uso_final_plaguicidas_otro",
                      "public"."tarjeta_familiar"."lavar_verduras_frutas_crudas",
                      "public"."tarjeta_familiar"."encender_velas_velones",
                      "public"."tarjeta_familiar"."frecuencia_humo_en_vivienda",
                      "public"."tarjeta_familiar"."accidente_lesion_ultimo_anio",
                      "public"."tarjeta_familiar"."tipo_lesion_accidente",
                      "public"."tarjeta_familiar"."secuelas_accidentes",
                      "public"."tarjeta_familiar"."accidentes_frecuentes_en_ninos",
                      "public"."tarjeta_familiar"."hay_ninos_menores_5_anos",
                      "public"."tarjeta_familiar"."menores_cinco_annos",
                      "public"."tarjeta_familiar"."morbilidad_agudo",
                      "public"."tarjeta_familiar"."busqueda_ayuda_enfermedad_ninos",
                      "public"."tarjeta_familiar"."edad_promedio_lactancia_materna",
                      "public"."tarjeta_familiar"."esquema_vacunacion_completo_ninos",
                      "public"."tarjeta_familiar"."esquema_vacunacion_completo_ninos_porque_no",
                      "public"."tarjeta_familiar"."purgado_ninos_ultimo_anio",
                      "public"."tarjeta_familiar"."purgado_ninos_ultimo_anio_cuantas_veces",
                      "public"."tarjeta_familiar"."mayores_cinco_annos",
                      "public"."tarjeta_familiar"."mayores_cinco_annos_morbilidad_aguda",
                      "public"."tarjeta_familiar"."otra_enfermedad_ultimo_mes",
                      "public"."tarjeta_familiar"."sufrimiento_enfermedades",
                      "public"."tarjeta_familiar"."enfermedades_miembros_familia",
                      "public"."tarjeta_familiar"."frecuencia_visitas_odontologo",
                      "public"."tarjeta_familiar"."muerte_familiares_ultimo_cinco_anos_violenta_accidente",
                      "public"."tarjeta_familiar"."muerte_familiares_ultimo_cinco_anos_violenta_accidente_otro",
                      "public"."tarjeta_familiar"."tipo_vivienda_repetido",
                      "public"."tarjeta_familiar"."autoconstruccion_vivienda",
                      "public"."tarjeta_familiar"."topografia_terreno",
                      "public"."tarjeta_familiar"."cerca_vivienda",
                      "public"."tarjeta_familiar"."cerca_zonas_recreativas",
                      "public"."tarjeta_familiar"."material_piso",
                      "public"."tarjeta_familiar"."material_paredes",
                      "public"."tarjeta_familiar"."material_techo",
                      "public"."tarjeta_familiar"."ambientes_separados",
                      "public"."tarjeta_familiar"."cuartos_dormitorio",
                      "public"."tarjeta_familiar"."observe_donde_duerme_personas",
                      "public"."tarjeta_familiar"."cantidad_camas",
                      "public"."tarjeta_familiar"."ventilacion_natural_cocina",
                      "public"."tarjeta_familiar"."elementos_separados_casa",
                      "public"."tarjeta_familiar"."tipo_alumbrado",
                      "public"."tarjeta_familiar"."elementos_pertenencias",
                      "public"."tarjeta_familiar"."disposicion_excretas",
                      "public"."tarjeta_familiar"."sanitario_letrina_distancia_cercana",
                      "public"."tarjeta_familiar"."cantidad_inodoros_sanitarios",
                      "public"."tarjeta_familiar"."ubicacion_sanitario",
                      "public"."tarjeta_familiar"."lavamanos_cerca_sanitario",
                      "public"."tarjeta_familiar"."manejo_basura",
                      "public"."tarjeta_familiar"."recogida_basura",
                      "public"."tarjeta_familiar"."convivencia_animales",
                      "public"."tarjeta_familiar"."lugar_preparacion_alimentos",
                      "public"."tarjeta_familiar"."material_mesa_alimentos",
                      "public"."tarjeta_familiar"."almacenamiento_alimentos",
                      "public"."tarjeta_familiar"."almacenamiento_conjunto_productos",
                      "public"."tarjeta_familiar"."notas",
                      "public"."pacientes"."nombre_primero",
                      "public"."pacientes"."nombre_segundo",
                      "public"."pacientes"."apellido_primero",
                      "public"."pacientes"."apellido_segundo",
                      "public"."pacientes"."parentesco",
                      "public"."pacientes"."ocupacion",
                      "public"."pacientes"."nivel_escolaridad",
                      "public"."pacientes"."grupo_atencion_especial",
                      "public"."pacientes"."documento_tipo",
                      "public"."pacientes"."documento_numero",
                      "public"."pacientes"."genero",
                      "public"."pacientes"."estado_civil",
                      "public"."pacientes"."tipo_afiliacion_salud",
                      "public"."pacientes"."discapacidad",
                      "public"."pacientes"."fecha_nacimiento",
                      "public"."pacientes"."aporta_ingresos",
                      "public"."psicosocial_persona"."ustedes_recibieron_ayuda_de_quien",
                      "public"."psicosocial_persona"."ustedes_recibieron_ayuda_que_tipo",
                      "public"."psicosocial_persona"."principal_necesidad",
                      "public"."psicosocial_persona"."de_que_lugar",
                      "public"."psicosocial_persona"."que_le_gusta_o_menos_gusta",
                      "public"."psicosocial_persona"."lugar_preferido_dentro_casa",
                      "public"."psicosocial_persona"."en_que_o_porque_capacitarse",
                      "public"."psicosocial_persona"."de_que_o_porque_emprender",
                      "public"."psicosocial_persona"."condiciones_vida_en_un_ano",
                      "public"."psicosocial_persona"."dedicacion_tiempo_libre",
                      "public"."psicosocial_persona"."ustedes_recibieron_ayuda",
                      "public"."psicosocial_persona"."desplazamiento",
                      "public"."psicosocial_persona"."deseos_volver",
                      "public"."psicosocial_persona"."despues_desplazamiento_rechazo_discriminacion",
                      "public"."psicosocial_persona"."cambios_despues_desplazamiento",
                      "public"."psicosocial_persona"."afectados_negativamente_desplazamiento",
                      "public"."psicosocial_persona"."desplazamiento_positivo",
                      "public"."psicosocial_persona"."a_gusto_en_vivienda",
                      "public"."psicosocial_persona"."consumo_alimentos",
                      "public"."psicosocial_persona"."casos_maltrato_o_violencia",
                      "public"."psicosocial_persona"."ayuda_o_denuncia",
                      "public"."psicosocial_persona"."decisiones_importantes_en_familia",
                      "public"."psicosocial_persona"."correccion_de_problemas_en_familia",
                      "public"."psicosocial_persona"."resolucion_problemas_en_comunidad",
                      "public"."psicosocial_persona"."necesidad_capacitarse",
                      "public"."psicosocial_persona"."emprender_negocio",
                      "public"."psicosocial_persona"."molestias_salud",
                      "public"."psicosocial_persona"."cambios_en_menores_15_anos",
                      "public"."psicosocial_persona"."felicidad_actual"
                  FROM     "public"."tarjeta_familiar"
                  INNER JOIN "public"."ficha"  ON "public"."tarjeta_familiar"."ficha_id" = "public"."ficha"."id"
                  INNER JOIN "public"."psicosocial_persona"  ON "public"."psicosocial_persona"."ficha_id" = "public"."ficha"."id"
                  INNER JOIN "public"."pacientes"  ON "public"."psicosocial_persona"."paciente_id" = "public"."pacientes"."id"
                  INNER JOIN "public"."user"  ON "public"."user"."id" = "public"."ficha"."usuario_creacion_id"

                  order by
                  "public"."ficha"."codigo",
                  "public"."pacientes"."updated_at"`;
    return await this.entityManager.query(query);
  }

  private async findAllFormsDescription(): Promise<FichaDescripcionEntity[]> {
    const fichaDescripcion: any[] = await this.fichaDescripcionEntityRepository
      .createQueryBuilder('descripcion')
      .innerJoinAndSelect('descripcion.fichaGrupo', 'grupo')
      .orderBy('grupo.orden', 'ASC')
      .addOrderBy('descripcion.orden', 'ASC')
      .select(['descripcion.columnName', 'descripcion.label'])
      .getMany();
    fichaDescripcion.push({ columnName: 'version', label: 'Versión' });
    fichaDescripcion.push({
      columnName: 'codigo',
      label: 'Código de encuesta'
    });
    return fichaDescripcion as FichaDescripcionEntity[];
  }

  private async exportToExcel(data: any[]): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach(item => {
      const row = headers.map(header => item[header]);
      worksheet.addRow(row);
    });
    return workbook.xlsx.writeBuffer();
  }
}

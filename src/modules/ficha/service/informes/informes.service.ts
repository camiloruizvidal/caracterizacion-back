import { FichaDescripcionEntity } from '../../entity/ficha-descripcion.entity';
import { PsicosocialPersonaEntity } from '../../entity/psicosocial-persona.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

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
    console.log('entro');
    try {
      const query = `
    SELECT *
    FROM
      "public"."psicosocial_persona"
    INNER JOIN
      "public"."pacientes" ON "public"."psicosocial_persona"."paciente_id" = "public"."pacientes"."id"
    INNER JOIN
      "public"."ficha" ON "public"."psicosocial_persona"."ficha_id" = "public"."ficha"."id"
    INNER JOIN
      "public"."tarjeta_familiar" ON "public"."tarjeta_familiar"."ficha_id" = "public"."ficha"."id";
  `;
      const informe: any[] = await this.entityManager.query(query);
      const fichaDescripcion: any[] =
        await this.fichaDescripcionEntityRepository.find(/*{
          select: ['columnName', 'label']
        }*/);

      fichaDescripcion.push({ columnName: 'version', label: 'Versión' });
      fichaDescripcion.push({
        columnName: 'codigo',
        label: 'Código de encuesta'
      });
      const mapearItem = informeItem => {
        const resultadoItem = {};

        for (const key in informeItem) {
          const descripcion = fichaDescripcion.find(
            desc => desc.columnName === key
          );

          if (descripcion) {
            resultadoItem[descripcion.label] = informeItem[key];
          }
        }

        return resultadoItem;
      };
      return await this.exportToExcel(informe.map(mapearItem));
    } catch (error) {
      console.log({ error });
      throw error;
    }
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

    // Devolver el contenido del archivo como un buffer
    return workbook.xlsx.writeBuffer();
  }
}

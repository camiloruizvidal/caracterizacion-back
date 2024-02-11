import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/fichaGrupo.entity';
import { FichaDescripcionEntity } from '../../entity/fichaDescription.entity';
import { VersionEntity } from '../../entity/version.entity';
import { FichaTipoEntity } from '../../entity/fichaTipo.entity';
import { IFichaCard } from '../../interface/ficha.interface';
import { PersonaEntity } from '../../entity/persona.entity';
import { BackupEntity } from '../../entity/backup.entity';
import { FichaEntity } from '../../entity/ficha.entity';

@Injectable()
export class FichaService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepository: Repository<BackupEntity>,

    @InjectRepository(FichaDescripcionEntity)
    private readonly fichaDescripcionRepository: Repository<FichaDescripcionEntity>,

    @InjectRepository(FichaGrupoEntity)
    private readonly fichaGrupoRepository: Repository<FichaGrupoEntity>,

    @InjectRepository(FichaTipoEntity)
    private readonly fichaTipoRepository: Repository<FichaTipoEntity>,

    @InjectRepository(VersionEntity)
    private readonly versionRepository: Repository<VersionEntity>,

    @InjectRepository(VersionEntity)
    private readonly personaRepository: Repository<PersonaEntity>
  ) {}

  public async getFichaFormat(): Promise<IFichaCard> {
    try {
      const fichasGrupos: FichaGrupoEntity[] =
        await this.fichaGrupoRepository.find({
          order: { orden: 'ASC' }
        });

      const fichasDescripcion: FichaDescripcionEntity[] =
        await this.fichaDescripcionRepository.find({
          order: { orden: 'ASC' }
        });

      const fichaTipo: FichaTipoEntity[] =
        await this.fichaTipoRepository.find();

      const version = await this.versionRepository.findOne({
        where: { id: MoreThan(0) },
        order: { id: 'DESC' }
      });

      const dataFormat: IFichaCard = {
        version: version.id.toString(),
        dateLastVersion: version.dateLastVersion,
        familyCard: [],
        personCard: []
      };

      const fichasResult = fichasGrupos.map((grupos: FichaGrupoEntity) => {
        grupos['values'] =
          fichasDescripcion
            .filter(
              (ficha: FichaDescripcionEntity) =>
                ficha.ficha_grupo_id == grupos.id
            )
            .map((ficha: FichaDescripcionEntity) => {
              ficha.options = JSON.parse(ficha.options);
              ficha.visibility = JSON.parse(ficha.visibility);
              ficha.required = JSON.parse(ficha.required);
              ficha['value'] = ficha.default;
              return ficha;
            }) || [];

        return grupos;
      });

      fichaTipo.forEach((tipos: FichaTipoEntity) => {
        dataFormat[tipos.nombre] = fichasResult.filter(
          ficha => ficha.ficha_tipo_id === tipos.id
        );
      });

      return dataFormat;
    } catch (error) {
      throw error.message;
    }
  }

  public async getPeopelData(): Promise<PersonaEntity[]> {
    try {
      const person: PersonaEntity[] = await this.personaRepository.find();
      return person;
    } catch (error) {
      throw error.message;
    }
  }

  public async saveRegisterBackup(data: any): Promise<boolean> {
    try {
      const backup = this.backupRepository.create({
        data
      });
      await this.backupRepository.save(backup);
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async loadFormsPage(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: BackupEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  }> {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await this.backupRepository.findAndCount({
      take: pageSize,
      skip
    });

    return {
      data,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      itemsPerPage: pageSize
    };
  }
}

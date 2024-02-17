import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/fichaGrupo.entity';
import { FichaDescripcionEntity } from '../../entity/fichaDescription.entity';
import { VersionEntity } from '../../entity/version.entity';
import { FichaTipoEntity } from '../../entity/fichaTipo.entity';
import { IFichaCard } from '../../interface/ficha.interface';
import { PersonaEntity } from '../../entity/persona.entity';
import { BackupEntity, IStatus } from '../../entity/backup.entity';
import { UserEntity } from 'src/modules/usuarios/entity/user.entity';
import { PsicosocialPersonaEntity } from '../../entity/psicosocial-persona.entity';

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

    @InjectRepository(PersonaEntity)
    private readonly personaRepository: Repository<PersonaEntity>,

    @InjectRepository(PsicosocialPersonaEntity)
    private readonly psicosocialPersonaRepository: Repository<PsicosocialPersonaEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
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
    data: any[];
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
    const allUser = await this.userRepository.find();
    const dataResponse = await this.addUsers(data, allUser);
    return {
      data: dataResponse,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      itemsPerPage: pageSize
    };
  }
  private async addUsers(data: any[], users: UserEntity[]) {
    return data.map(IFamilyCard => {
      IFamilyCard['user'] = users.find(
        user => IFamilyCard.data.userId === user.id
      );
      return IFamilyCard;
    });
  }

  public async procesarFichasSubidasConUltimaVersion() {
    try {
      const version: VersionEntity = await this.versionRepository.findOne({
        where: { id: MoreThan(0) },
        order: { id: 'DESC' }
      });

      const cards = await this.loadLastCards(1536 /*version.id*/);
      const personsEncuesta: any[] = this.extractDataTable({
        cards,
        typeCard: 'personCard',
        table: 'psicosocial_persona'
      });
      const persons: any[] = this.extractDataTable({
        cards,
        typeCard: 'personCard',
        table: 'persona'
      });
      return this.saveRegisters({ persons, personsEncuesta });
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  private async loadLastCards(versionId: number) {
    const cards: any[] = await this.backupRepository.find({
      where: { status: IStatus.Almacenado }
    });
    return cards
      .filter(card => Number(card.data.version) == versionId)
      .map(card => card.data.data) as BackupEntity[];
  }

  private extractDataTable(data: {
    cards: any[];
    typeCard: string;
    table: string;
  }): any {
    const { cards, typeCard, table } = data;
    return cards.flatMap(card =>
      card[typeCard].flatMap(valueCard => [
        valueCard
          .find(items => items.table === table)
          .values.reduce(
            (acc, value) => ({ ...acc, [value.columnName]: value.value }),
            {}
          )
      ])
    );
  }

  private async saveRegisters(dataToSave: {
    persons: any[];
    personsEncuesta: any[];
  }) {
    const { persons, personsEncuesta } = dataToSave;

    for (let index = 0; index < persons.length; index++) {
      try {
        const personSave = await this.guardarPersona(persons[index]);
        console.log('Person saved:', personSave);
        const personEncuesta: PsicosocialPersonaEntity = personsEncuesta[index];
        personEncuesta.personaId = personSave.id;

        const createPsicosocial =
          this.psicosocialPersonaRepository.create(personEncuesta);
        await this.psicosocialPersonaRepository.save(createPsicosocial);
        console.log('Psicosocial saved:', createPsicosocial);
      } catch (error) {
        console.error('Error saving:', error);
        throw error;
      }
    }
  }

  private async guardarPersona(
    personaData: PersonaEntity
  ): Promise<PersonaEntity> {
    const existente = await this.personaRepository.findOne({
      where: {
        documentoNumero: personaData?.documentoNumero
      }
    });

    if (existente) {
      return await this.personaRepository.save({
        ...existente,
        ...personaData
      });
    } else {
      const nuevaPersona = this.personaRepository.create(personaData);
      return await this.personaRepository.save(nuevaPersona);
    }
  }
}

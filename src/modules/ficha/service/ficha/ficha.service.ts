import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/fichaGrupo.entity';
import { FichaDescripcionEntity } from '../../entity/fichaDescription.entity';
import { VersionEntity } from '../../entity/version.entity';
import { FichaTipoEntity } from '../../entity/fichaTipo.entity';
import { IFamilyCardSave, IFichaCard } from '../../interface/ficha.interface';
import { PersonaEntity } from '../../entity/persona.entity';
import { BackupEntity, IStatus } from '../../entity/backup.entity';
import { UserEntity } from 'src/modules/usuarios/entity/user.entity';
import { PsicosocialPersonaEntity } from '../../entity/psicosocial-persona.entity';
import { FichaEntity } from '../../entity/ficha.entity';
import { TarjetaFamiliarEntity } from '../../entity/tarjetaFamiliar.entity';

@Injectable()
export class FichaService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepository: Repository<BackupEntity>,

    @InjectRepository(FichaDescripcionEntity)
    private readonly fichaDescripcionRepository: Repository<FichaDescripcionEntity>,

    @InjectRepository(FichaEntity)
    private readonly fichaRepository: Repository<FichaEntity>,

    @InjectRepository(FichaGrupoEntity)
    private readonly fichaGrupoRepository: Repository<FichaGrupoEntity>,

    @InjectRepository(FichaTipoEntity)
    private readonly fichaTipoRepository: Repository<FichaTipoEntity>,

    @InjectRepository(TarjetaFamiliarEntity)
    private readonly tarjetaFamiliarRepository: Repository<TarjetaFamiliarEntity>,

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

      const cards = await this.loadLastCards(version.id);
      const registers: any[] = [];
      cards
        .map(card => card.data.data)
        .forEach(async (card: any, index: number) => {
          const register = await this.createRegister(card, cards, index);
          registers.push(register);
        });
      return registers;
    } catch (error) {
      throw error;
    }
  }

  private async createRegister(card, cards, index) {
    const personsEncuesta = this.extractDataTable({
      card,
      typeCard: 'personCard',
      table: 'psicosocial_persona'
    });
    const persons = this.extractDataTable({
      card,
      typeCard: 'personCard',
      table: 'persona'
    });
    const familyCard = this.extractDataTable(
      {
        card,
        typeCard: 'familyCard',
        table: 'tarjeta_familiar'
      },
      false
    );
    return await this.saveRegisters({
      card: {
        version: cards[index].data.version,
        dateLastVersion: cards[index].data.dateLastVersion,
        dateRegister: cards[index].data.dateRegister,
        code: cards[index].data.code,
        userId: cards[index].data.userId,
        familyCard
      },
      persons,
      personsEncuesta,
      familyCard
    });
  }

  private async loadLastCards(versionId: number) {
    const cards: any[] = await this.backupRepository.find({
      where: { status: IStatus.Almacenado }
    });
    return cards.filter(card => Number(card.data.version) == versionId);
  }

  private extractDataTable(
    data: {
      card: any;
      typeCard: string;
      table: string;
    },
    isArray: boolean = true
  ): any {
    const { card, typeCard, table } = data;
    let result;
    if (!isArray) {
      result = card[typeCard].reduce((result, card) => {
        const valuesSets = card.values;
        valuesSets.forEach(values => {
          result[values.columnName] = values.value;
        });
        return result;
      }, {});
    } else {
      result = card[typeCard].flatMap(valueCard => [
        valueCard
          .find(items => items.table === table)
          .values.reduce(
            (acc, value) => ({ ...acc, [value.columnName]: value.value }),
            {}
          )
      ]);
    }
    return result;
  }

  private async saveRegisters(dataToSave: {
    persons: any[];
    personsEncuesta: any[];
    card: any;
    familyCard: any;
  }) {
    const { familyCard, card, persons, personsEncuesta } = dataToSave;
    const ficha = await this.guardarFicha(card);
    this.guardarTarjetaFamiliar(familyCard, ficha);
    for (let index = 0; index < persons.length; index++) {
      try {
        const personSave = await this.guardarPersona(persons[index]);
        const personEncuesta: PsicosocialPersonaEntity = personsEncuesta[index];
        personEncuesta.fichaId = ficha.id;
        personEncuesta.personaId = personSave.id;
        await this.guardarEncuesta(personEncuesta);
      } catch (error) {
        throw error;
      }
    }
    return ficha;
  }

  private async guardarEncuesta(personEncuesta: PsicosocialPersonaEntity) {
    const create = this.psicosocialPersonaRepository.create(personEncuesta);
    return await this.psicosocialPersonaRepository.save(create);
  }

  private async guardarPersona(
    personaData: PersonaEntity
  ): Promise<PersonaEntity> {
    const existente = await this.personaRepository.findOne({
      where: {
        documento_numero: personaData?.documento_numero
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

  private async guardarFicha(card: IFamilyCardSave): Promise<FichaEntity> {
    const fichaCreate = this.fichaRepository.create({
      usuario_creacion_id: card.userId,
      version: Number(card.version),
      codigo: card.code,
      fecha_registro: card.dateRegister
    });
    const data = await this.fichaRepository.save(fichaCreate);
    return data;
  }

  private async guardarTarjetaFamiliar(
    familyCard: TarjetaFamiliarEntity,
    ficha: FichaEntity
  ) {
    const tarjetaFamiliar = this.tarjetaFamiliarRepository.create(familyCard);
    tarjetaFamiliar.ficha = ficha;
    return await this.tarjetaFamiliarRepository.save(tarjetaFamiliar);
  }
}

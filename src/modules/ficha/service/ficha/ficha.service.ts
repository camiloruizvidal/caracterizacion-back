import { FichaDescripcionEntity } from '../../entity/ficha-descripcion.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/ficha-grupo.entity';
import { VersionEntity } from '../../entity/version.entity';
import { FichaTipoEntity } from '../../entity/ficha-tipo.entity';
import { IFamilyCardSave, IFichaCard } from '../../interface/ficha.interface';
import { BackupEntity, IStatus } from '../../entity/backup.entity';
import { UserEntity } from 'src/modules/usuarios/entity/user.entity';
import { PsicosocialPersonaEntity } from '../../entity/psicosocial-persona.entity';
import { FichaEntity } from '../../entity/ficha.entity';
import { TarjetaFamiliarEntity } from '../../entity/tarjeta-familiar.entity';
import { PacienteEntity } from 'src/modules/pacientes/entity/pacientes.entity';
import { ETables, IPagination } from 'src/utils/global.interface';
import { FichaJsonEntity } from '../../entity/ficha-json.entity';
import { FichaProcesadaEntity } from '../../entity/ficha-procesada.entity';

@Injectable()
export class FichaService {
  constructor(
    private readonly entityManager: EntityManager,
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

    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(PsicosocialPersonaEntity)
    private readonly psicosocialPersonaRepository: Repository<PsicosocialPersonaEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FichaJsonEntity)
    private readonly fichaJsonEntity: Repository<FichaJsonEntity>,

    @InjectRepository(FichaProcesadaEntity)
    private readonly fichaProcesadaEntity: Repository<FichaProcesadaEntity>
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

  public async getPeopelData(): Promise<PacienteEntity[]> {
    try {
      const paciente: PacienteEntity[] = await this.pacienteRepository.find();
      return paciente;
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
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / pageSize),
      itemsPerPage: Number(pageSize)
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
        .map(card => ({ card: card.data.data, id: card.id }))
        .forEach(async (card: any, index: number) => {
          const register = await this.createRegister(
            card.card,
            cards,
            index,
            card.id
          );
          registers.push(register);
        });
      return version;
    } catch (error) {
      throw error;
    }
  }

  private async createRegister(card, cards, index, backupId) {
    const personsEncuesta = this.extractDataTable({
      card,
      typeCard: 'personCard',
      table: ETables.PSICOSOCIAL_PERSONA
    });
    const persons = this.extractDataTable({
      card,
      typeCard: 'personCard',
      table: ETables.PACIENTE
    });
    const familyCard = this.extractDataTable(
      {
        card,
        typeCard: 'familyCard',
        table: ETables.TARJETA_FAMILIAR
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
      familyCard,
      backupId
    });
  }

  private async loadLastCards(versionId: number = 0) {
    const cards: any[] = await this.backupRepository.find({
      where: { status: IStatus.Almacenado }
    });
    return versionId === 0
      ? cards
      : cards.filter(card => Number(card.data.version) == versionId);
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
    if (isArray) {
      result = card[typeCard].flatMap(valueCard =>
        valueCard
          .filter(items => items.table === table)
          .map(item =>
            item.values.reduce(
              (acc, value) => ({ ...acc, [value.columnName]: value.value }),
              {}
            )
          )
      );
    } else {
      result = card[typeCard].reduce((result, card) => {
        const valuesSets = card.values;
        valuesSets.forEach(values => {
          result[values.columnName] = values.value;
        });
        return result;
      }, {});
    }
    return result;
  }

  private async saveRegisters(dataToSave: {
    persons: any[];
    personsEncuesta: any[];
    card: any;
    familyCard: any;
    backupId: number;
  }) {
    const { familyCard, card, persons, personsEncuesta, backupId } = dataToSave;
    const ficha = await this.guardarFicha(card);
    this.guardarTarjetaFamiliar(familyCard, ficha);
    for (let index = 0; index < persons.length; index++) {
      try {
        const personSave = await this.guardarPersona(persons[index]);
        const personEncuesta: PsicosocialPersonaEntity = personsEncuesta[index];
        personEncuesta.fichaId = ficha.id;
        personEncuesta.personaId = personSave.id;
        await this.guardarEncuesta(personEncuesta);
        const backup = await this.backupRepository.findOne({
          where: { id: backupId }
        });
      } catch (error) {
        throw error;
      }
    }

    const backup = await this.backupRepository.findOne({
      where: { id: backupId }
    });
    if (backup) {
      backup.status = IStatus.Guardado;
      return await this.backupRepository.save(backup);
    }
    return ficha;
  }

  private async guardarEncuesta(personEncuesta: PsicosocialPersonaEntity) {
    const create = this.psicosocialPersonaRepository.create(personEncuesta);
    return await this.psicosocialPersonaRepository.save(create);
  }

  private async guardarPersona(
    personaData: PacienteEntity
  ): Promise<PacienteEntity> {
    const existente = await this.pacienteRepository.findOne({
      where: {
        documento_numero: personaData?.documento_numero
      }
    });

    if (existente) {
      return await this.pacienteRepository.save({
        ...existente,
        ...personaData
      });
    } else {
      const nuevaPersona = this.pacienteRepository.create(personaData);
      return await this.pacienteRepository.save(nuevaPersona);
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

  public async loadFormsDetail(filtros: {
    fechaInicio: string;
    fechaFin: string;
    usuarioId: string;
    municipio: string;
    page: number;
    pageSize: number;
  }): Promise<IPagination<FichaEntity>> {
    const { fechaInicio, fechaFin, usuarioId, municipio, page, pageSize } =
      filtros;
    const query = this.fichaRepository
      .createQueryBuilder('ficha')
      .leftJoinAndSelect('ficha.tarjetasFamiliares', 'tarjetasFamiliares')
      .leftJoinAndSelect('ficha.psicosocialPersonas', 'psicosocialPersonas')
      .leftJoinAndSelect('psicosocialPersonas.persona', 'persona')
      .orderBy('ficha.codigo', 'DESC')
      .addOrderBy('ficha.fecha_registro', 'ASC');

    if (fechaInicio && fechaInicio != '') {
      query.andWhere('date(ficha.fecha_registro) >= date(:fechaInicio)', {
        fechaInicio
      });
    }

    if (fechaFin && fechaFin != '') {
      query.andWhere('date(ficha.fecha_registro) <= date(:fechaFin)', {
        fechaFin
      });
    }

    if (usuarioId && usuarioId != '') {
      query.andWhere('ficha.usuario_creacion_id = :usuarioId', { usuarioId });
    }

    const [items, totalItems] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationInfo: IPagination<FichaEntity> = {
      data: items,
      totalItems: Number(totalItems),
      currentPage: Number(page),
      totalPages: Number(totalPages),
      itemsPerPage: Number(pageSize)
    };
    return paginationInfo;
  }

  public async loadFormDetail(
    id: number
  ): Promise<{ ficha: FichaEntity; descripcion: FichaDescripcionEntity[] }> {
    const ficha = await this.fichaRepository.findOne({
      where: { id },
      relations: [
        'tarjetasFamiliares',
        'psicosocialPersonas.persona',
        'usuario_creacion'
      ]
    });
    const descripcion = await this.fichaDescripcionRepository.find();
    return { ficha, descripcion };
  }

  public async getGroups() {
    try {
      return await this.fichaGrupoRepository.find();
    } catch (error) {
      console.log({ error });
    }
  }

  public async nuevoFormatoFicha(dataFamilyCard: any) {
    const values = await this.fichaJsonEntity.findOne({
      where: { id: dataFamilyCard.id }
    });
    const dataForm = this.fichaJsonEntity.create({
      isFinish: dataFamilyCard.isFinish,
      version: dataFamilyCard.version,
      dateLastVersion: dataFamilyCard.dateLastVersion,
      familyCard: dataFamilyCard.familyCard,
      personCard: dataFamilyCard.personCard
    });
    if (values) {
      return await this.fichaJsonEntity.update(dataFamilyCard.id, dataForm);
    } else {
      return await this.fichaJsonEntity.save(dataForm);
    }
  }

  public async obtenerFichaJson(id: number) {
    let values = await this.fichaJsonEntity.findOne({ where: { id } });
    if (!values) {
      values = {
        id: null,
        isFinish: false,
        version: null,
        dateLastVersion: new Date(),
        familyCard: [],
        personCard: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return values;
  }

  public async nuevoGrupo(data: any) {
    const response = this.fichaGrupoRepository.create(data);
    return await this.fichaGrupoRepository.save(response);
  }

  public async procesarFicha() {
    const cards = await this.loadLastCards();

    try {
      cards.forEach(async card => {
        const {
          version,
          dateLastVersion,
          dateRegister,
          code: codigo
        } = card.data;
        const { familyCard, personCard } = card.data.data;

        await this.fichaProcesadaEntity.save({
          usuarioCreacionId: 1,
          version,
          dateLastVersion,
          dateRegister,
          codigo,
          familyCard,
          personCard
        });
        await this.backupRepository.update(card.id, {
          status: IStatus.Guardado
        });
      });
    } catch (error) {
      throw error;
    }
    return cards;
  }
}

import { UsuarioRepository } from './../../../usuarios/repository/usuario.repository';
import { FichaRepository } from './../../repository/ficha.repository';
import { FichaDescripcionEntity } from '../../entity/ficha-descripcion.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/ficha-grupo.entity';
import { VersionEntity } from '../../entity/version.entity';
import { FichaTipoEntity } from '../../entity/ficha-tipo.entity';
import { IFamilyCardSave, IFichaCard } from '../../interface/ficha.interface';
import { BackupEntity, IStatus } from '../../entity/backup.entity';
import { PsicosocialPersonaEntity } from '../../entity/psicosocial-persona.entity';
import { FichaEntity } from '../../entity/ficha.entity';
import { TarjetaFamiliarEntity } from '../../entity/tarjeta-familiar.entity';
import { PacienteEntity } from 'src/modules/pacientes/entity/pacientes.entity';
import { ETables, IPagination } from 'src/utils/global.interface';
import { FichaJsonEntity } from '../../entity/ficha-json.entity';
import { FichaProcesadaEntity } from '../../entity/ficha-procesada.entity';
import { FichaDescripcionRepository } from '../../repository/ficha-descripcion.repository';
import { FichaTipoRepository } from '../../repository/ficha-tipo.repository';
import { FichaGrupoRepository } from '../../repository/ficha-grupo.repository';
import { BackupRepository } from '../../repository/backup.repository';
import { VersionRepository } from '../../repository/version.repository';
import { FichaProcesadaRepository } from '../../repository/ficha-procesada.repository';
import { FichaJsonRepository } from '../../repository/ficha-json.repository';

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

    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(PsicosocialPersonaEntity)
    private readonly psicosocialPersonaRepository: Repository<PsicosocialPersonaEntity>,

    @InjectRepository(FichaJsonEntity)
    private readonly fichaJsonEntity: Repository<FichaJsonEntity>,

    @InjectRepository(FichaProcesadaEntity)
    private readonly fichaProcesadaEntity: Repository<FichaProcesadaEntity>
  ) {}

  public async obternerFormatoFicha(): Promise<IFichaCard> {
    try {
      const fichasGrupos: any[] = await FichaGrupoRepository.obtenerGrupos();
      const fichasDescripcion: any[] =
        await FichaDescripcionRepository.obtenerFichasDescripcion();

      const fichasTipo: any[] = await FichaTipoRepository.obtenerTiposFichas();

      const version = await VersionRepository.obtenerUltimaVersion();

      const dataFormateada: IFichaCard = {
        version: version.id.toString(),
        dateLastVersion: version.dateLastVersion,
        familyCard: [],
        personCard: []
      };

      const fichasResult = fichasGrupos.map(grupos => {
        grupos['values'] =
          fichasDescripcion
            .filter((ficha: any) => ficha.ficha_grupo_id == grupos.id)
            .map((ficha: any) => {
              ficha.options = JSON.parse(ficha.options);
              ficha.visibility = JSON.parse(ficha.visibility);
              ficha.required = JSON.parse(ficha.required);
              ficha['value'] = ficha.default;
              return ficha;
            }) || [];

        return grupos;
      });

      fichasTipo.forEach((tipos: any) => {
        dataFormateada[tipos.nombre] = fichasResult.filter(
          ficha => ficha.ficha_tipo_id === tipos.id
        );
      });

      return dataFormateada;
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
    const registros = await BackupRepository.verBackupsPaginados(
      page,
      pageSize
    );
    const usuarios = await UsuarioRepository.obtenerTodosUsuarios();
    const data = await this.agregarUsuario(registros.rows, usuarios);
    return {
      data,
      totalItems: registros.count,
      currentPage: Number(page),
      totalPages: Math.ceil(registros.count / pageSize),
      itemsPerPage: Number(pageSize)
    };
  }

  private async agregarUsuario(data: any[], usuarios: any[]) {
    return data.map(IFamilyCard => {
      IFamilyCard['user'] = usuarios.find(
        usuario => IFamilyCard.data.userId === usuario.id
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

  private async guardarFicha(card: IFamilyCardSave): Promise<any> {
    return await FichaRepository.crearFicha(
      card.userId,
      Number(card.version),
      card.code,
      card.dateRegister
    );
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
  }): Promise<IPagination<any>> {
    const fichas: IPagination<any> =
      await FichaRepository.cargarFichaPaginada(filtros);
    return fichas;
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
      console.error({ error });
      throw error;
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
    return await FichaJsonRepository.obtenerFichaJson(id);
  }

  public async nuevoGrupo(data: any) {
    const response = this.fichaGrupoRepository.create(data);
    return await this.fichaGrupoRepository.save(response);
  }

  public async procesarFicha() {
    await FichaProcesadaRepository.procesarBackupsAlmacenadas(1);
  }
}

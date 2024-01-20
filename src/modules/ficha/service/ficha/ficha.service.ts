import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/fichaGrupo.entity';
import { FichaDescripcionEntity } from '../../entity/fichaDescription.entity';
import { VersionEntity } from '../../entity/version.entity';
import { FichaTipoEntity } from '../../entity/fichaTipo.entity';

@Injectable()
export class FichaService {
  constructor(
    @InjectRepository(FichaDescripcionEntity)
    private readonly fichaDescripcionRepository: Repository<FichaDescripcionEntity>,

    @InjectRepository(FichaGrupoEntity)
    private readonly fichaGrupoRepository: Repository<FichaGrupoEntity>,

    @InjectRepository(FichaTipoEntity)
    private readonly fichaTipoRepository: Repository<FichaTipoEntity>,

    @InjectRepository(VersionEntity)
    private readonly versionRepository: Repository<VersionEntity>
  ) {}

  public async getFichaFormat(): Promise<any> {
    const fichasGrupos: FichaGrupoEntity[] =
      await this.fichaGrupoRepository.find();

    const fichasDescripcion: FichaDescripcionEntity[] =
      await this.fichaDescripcionRepository.find();

    const fichaTipo: FichaTipoEntity[] = await this.fichaTipoRepository.find();

    const version = await this.versionRepository.findOne({
      where: { id: MoreThan(0) },
      order: { id: 'DESC' }
    });

    const fichasResult = fichasGrupos.map((grupos: FichaGrupoEntity) => {
      grupos['values'] =
        fichasDescripcion.filter(
          (ficha: FichaDescripcionEntity) => ficha.ficha_grupo_id == grupos.id
        ) || [];
      return grupos;
    });

    fichaTipo.forEach((tipos: FichaTipoEntity) => {
      version[tipos.nombre] = fichasResult.find(
        ficha => ficha.ficha_tipo_id === tipos.id
      );
    });

    return version;
  }
}

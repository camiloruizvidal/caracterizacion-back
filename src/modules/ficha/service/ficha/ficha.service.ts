import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FichaGrupoEntity } from '../../entity/ficha_grupo.entity';
import { FichaDescripcionEntity } from '../../entity/ficha_description.entity';

@Injectable()
export class FichaService {

    constructor(
        @InjectRepository(FichaDescripcionEntity)
        private readonly fichaDescripcionRepository: Repository<FichaDescripcionEntity>,
        @InjectRepository(FichaGrupoEntity)
        private readonly fichaGrupoRepository: Repository<FichaGrupoEntity>,
    ) {}

    public async getFichaFormat(): Promise<any> {

        const fichasGrupos: FichaGrupoEntity[]
                    = await this.fichaGrupoRepository.find();
        const fichasDescripcion: FichaDescripcionEntity[]
                    = await this.fichaDescripcionRepository.find();

        return fichasGrupos.map((grupos: FichaGrupoEntity) => {
            const fichas = fichasDescripcion
                                .filter((ficha:FichaDescripcionEntity) => ficha.ficha_grupo_id == grupos.id) || [];
            grupos['ficha'] = fichas
            return grupos;
        });

    }

}

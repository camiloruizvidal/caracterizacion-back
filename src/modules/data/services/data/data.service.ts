import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FichaDescripcionEntity } from 'src/modules/ficha/entity/ficha-descripcion.entity';
import { UserEntity } from 'src/modules/usuarios/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(FichaDescripcionEntity)
    private readonly fichaDescripcionEntityRepository: Repository<FichaDescripcionEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>
  ) {}

  public async getMunicipalities(): Promise<
    { value: string; option: string }[]
  > {
    try {
      const municipioFicha =
        await this.fichaDescripcionEntityRepository.findOne({
          where: { columnName: 'municipio' }
        });
      return JSON.parse(municipioFicha.options) as {
        value: string;
        option: string;
      }[];
    } catch (error) {
      throw error;
    }
  }

  public async getCaracterizadores(): Promise<UserEntity[]> {
    try {
      return await this.userEntityRepository.find();
    } catch (error) {
      throw error;
    }
  }
}

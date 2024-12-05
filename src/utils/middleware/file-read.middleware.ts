import { Config } from 'src/Config/Config';
import { EFileStatus } from './../global.interface';
import { CacheService } from './../cache.service';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileReadyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const archivo = req.params['0'];
    const ruta = join(__dirname, '..', '..', Config.FOLDER_FILES_URL, archivo);

    if (fs.existsSync(ruta)) {
      throw new HttpException(
        `El archivo "${archivo}" no existe.`,
        HttpStatus.NOT_FOUND
      );
    }

    const status = CacheService.getFileStatus(archivo);
    if (status !== EFileStatus.COMPLETED) {
      throw new HttpException(
        `El archivo "${archivo}" aún está en estado "${status}".`,
        HttpStatus.CONFLICT
      );
    }

    next();
  }
}

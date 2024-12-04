import { EFileStatus } from './../global.interface';
import { CacheService } from './../cache.service';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus
} from '@nestjs/common';

@Injectable()
export class FileReadyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const archivo = req.params['0'];

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

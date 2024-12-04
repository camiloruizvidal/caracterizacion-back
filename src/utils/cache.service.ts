import { EFileStatus } from './global.interface';

export class CacheService {
  private static fileStatusCache: Map<string, EFileStatus> = new Map();

  public static setFileStatus(fileName: string, status: EFileStatus): void {
    CacheService.fileStatusCache.set(fileName, status);
  }

  public static getFileStatus(fileName: string): EFileStatus {
    return (
      CacheService.fileStatusCache.get(fileName) || EFileStatus.NOT_STARTED
    );
  }
}

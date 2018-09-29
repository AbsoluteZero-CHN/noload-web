import { BaseEntity } from '@shared/model/base-entity.model';

export class DownloaderTaskModel implements BaseEntity {
  public id?: string;
  public url?: string;
  public state?: number;
  public stateName?: string;
  public createTime?: Date;
  public completeTime?: Date;
  public timing?: boolean;
  public startTime?: Date;
}

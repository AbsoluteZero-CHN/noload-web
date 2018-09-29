import { BaseEntity } from '@shared/model/base-entity.model';

export class Page<T extends BaseEntity> {
  public first?: boolean;
  public content: T[];
  public size: number;
  public number: number;

  constructor() {
    this.size = 20;
    this.number = 1;
  }
}

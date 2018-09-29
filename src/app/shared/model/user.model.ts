import { BaseEntity } from '@shared/model/base-entity.model';

export class User implements BaseEntity {
  public id?: string;
  public login?: string;
  public name?: string;
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public imageUrl?: string;
  public activated?: boolean;
  public langKey?: string;
  public createdBy?: string;
  public createdDate?: Date;
  public lastModifiedDate?: Date;
  public lastModifiedBy?: string;
  public authorities?: string[];
}

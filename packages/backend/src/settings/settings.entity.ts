import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Settings {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  language: string;
  @Column()
  currency: [];
  @Column()
  statuses: [];
  @Column()
  contacts: any;
}

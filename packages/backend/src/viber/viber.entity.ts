import { ObjectID } from 'bson';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Viber {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  language: string;

  @Column()
  country: string;

  @Column()
  primary_device_os: string;

  @Column()
  api_version: number;

  @Column()
  viber_version: string;

  @Column()
  mcc: number;

  @Column()
  mnc: number;

  @Column()
  device_type: string;
}

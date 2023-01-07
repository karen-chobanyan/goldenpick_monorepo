import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { Gem } from '../gems/gem.entity';
import { Metal } from '../metals/metal.entity';

@Entity()
export class PublicFile {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  public url: string;

  @Column()
  public key: string;

  @Column()
  public name: string;

  @Column()
  public type: string;
}

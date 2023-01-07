import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class MetalPrice {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  id: string;

  @Column()
  price: number;

  @Column()
  name: string;

  @Column({ type: 'timestamptz' })
  date: Date;
}

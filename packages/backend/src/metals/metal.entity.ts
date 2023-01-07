import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Metal {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  owner: string;
  @Column()
  price1: number;
  @Column()
  price2: number;
  @Column()
  name: string;
  @Column()
  images: [
    {
      url: string;
    },
  ];
  @Column()
  probe: number;

  @Column()
  description: string;
}

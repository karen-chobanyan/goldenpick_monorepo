import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Gem {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;
  @Column()
  size: string;
  @Column()
  grade: string;
  @Column()
  price1: number;
  @Column()
  price2: number;
  @Column()
  images: [
    {
      url: string;
    },
  ];

  @Column()
  description: string;
}

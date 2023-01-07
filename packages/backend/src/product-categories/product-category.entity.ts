import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class ProductCategory {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  owner: string;
  @Column()
  name: string;
  @Column()
  parentCatId: string;
  @Column()
  images: [
    {
      url: string;
    },
  ];
}

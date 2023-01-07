import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { Gem } from '../gems/gem.entity';
import { Metal } from '../metals/metal.entity';

@Entity()
export class Product {
  password: string;

  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ length: 50, unique: false })
  name: string;

  @Column({ length: 1000, unique: false })
  description: string;

  @Column()
  categories: [any];

  @Column()
  tags: [string];

  @Column({ default: [] })
  images: [string];

  @Column({ default: [] })
  attachments: [string];

  @Column()
  owner: string;

  @Column()
  productGems: [{ gem: Gem; count: number }];

  @Column()
  productMetals: [{ metal: Metal; weight: number }];

  @Column()
  size: number;

  @Column()
  price1: number;

  @Column()
  price2: number;
}

import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  subtotal: number;

  @Column()
  subtotalUSD: number;

  @Column({ type: 'timestamptz' })
  createDate: Date;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'timestamptz' })
  statusUpdateDate: Date;

  @Column({ default: {} })
  public product: Product;

  @Column({ default: {} })
  public order_id: any;

  @Column({ default: {} })
  public customer: Contact;

  @Column({ default: {} })
  public teammate: any;

  @Column()
  payment: any;

  @Column()
  description: string;

  @Column()
  status: any;

  @Column()
  size: string;

  @Column()
  primary_color: string;

  @Column()
  secondary_color: string;

  @Column()
  expected_weight: string;

  @Column()
  probe: string;

  @Column()
  logs: [any];
}

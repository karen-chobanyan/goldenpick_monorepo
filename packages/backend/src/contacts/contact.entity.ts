import { ObjectID } from 'bson';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Contact {
  password: string;

  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ length: 500, unique: true, nullable: true })
  email: string;

  @Column({ length: 50, unique: false })
  fname: string;

  @Column({ length: 50, unique: false })
  lname: string;

  @Column({ length: 50, unique: false })
  jobTitle: string;

  @Column({ length: 50, unique: false })
  phone: string;

  @Column({ length: 50, unique: false })
  phone2: string;

  @Column({ length: 50, unique: false })
  phone3: string;

  @Column({ length: 50, unique: false })
  viberId: string;

  @Column({ length: 50, unique: false })
  address: string;

  @Column({ length: 50, unique: false })
  company: string;

  @Column({ length: 1000, unique: false })
  notes: string;

  @Column({ unique: false, default: 0, nullable: false })
  owner: number;

  @Column({ length: 500, unique: false, nullable: true })
  avatar: string;

  @Column({ length: 500, unique: false })
  images: [];
}

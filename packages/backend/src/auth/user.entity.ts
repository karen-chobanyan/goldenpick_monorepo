import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class User {
  password: string;

  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ length: 500, unique: true })
  email: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column()
  phone: string;

  @Column()
  userRole: any;

  @Column()
  userType: any;

  @Column()
  owner: string;

  @Column()
  photoURL: string;

  @Column()
  passwordHash: string;

  @Column()
  settings: {
    language: string;
    currency: [];
  };
}

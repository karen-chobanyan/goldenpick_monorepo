import { ConnectionOptions } from 'typeorm';

const mongoConfig: ConnectionOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_CONNECTION_STRING,
  database: process.env.MONGODB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  ssl: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export = mongoConfig;

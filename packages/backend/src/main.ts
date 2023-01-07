import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

const ViberBot = require('viber-bot').Bot;
const winston = require('winston');

const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});
client.initialize();
console.log(client);





function createLogger() {
  const logger = winston.createLogger({
    level: 'debug',
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
  return logger;
}
const logger = createLogger();

export const viberBot = new ViberBot(logger, {
  authToken: '4d6d9feadca7d3ad-c68c681b3aedebcb-6a3e54d2089e97d5',
  name: 'Tsar Jewelry',
  avatar:
    'https://scontent.fevn2-1.fna.fbcdn.net/v/t1.6435-9/67980071_101136344569803_7354494954476929024_n.png?_nc_cat=105&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=olw2RLRsqdoAX__6Ysz&_nc_ht=scontent.fevn2-1.fna&oh=0bd04054616e2479d3dcca9b2e4c4787&oe=60D535DF', // It is recommended to be 720x720, and no more than 100kb.
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/products', json({ limit: '50mb' }));
  app.use('/orders', json({ limit: '50mb' }));
  app.use('/contacts', json({ limit: '50mb' }));
  app.use('/auth', json({ limit: '50mb' }));
  app.use('/categories', json({ limit: '50mb' }));
  app.use('/metals', json({ limit: '50mb' }));
  app.use('/gems', json({ limit: '50mb' }));
  app.use('/dashboard', json({ limit: '50mb' }));
  app.use('/settings', json({ limit: '50mb' }));
  app.use('/roles', json({ limit: '50mb' }));
  app.use('/viber/proad-cast', json({ limit: '50mb' }));
  app.use('/viber/webhook', viberBot.middleware());

  await app.listen(4000, () => {
    viberBot
      .setWebhook('https://goldenpick.app/api/v1/viber/webhook')
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log('Can not set webhook on following server. Is it running?');
        console.error(error);
        process.exit(1);
      });

  });
}
bootstrap();

import { HttpModule, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/order.entity';
import { FilesService } from 'src/files/files.service';
import { PublicFile } from 'src/files/publicFile.entity';
import { Viber } from 'src/viber/viber.entity';
import { ViberService } from 'src/viber/viber.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PublicFile, Viber]), HttpModule],
  providers: [OrdersService, FilesService, ViberService],
  controllers: [OrdersController],
})
export class OrdersModule {}

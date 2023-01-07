import { Module } from '@nestjs/common';
import { MetalPriceService } from './metal-price.service';
import { MetalPriceController } from './metal-price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetalPrice } from './metal-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetalPrice])],
  controllers: [MetalPriceController],
  providers: [MetalPriceService],
})
export class MetalPriceModule {}

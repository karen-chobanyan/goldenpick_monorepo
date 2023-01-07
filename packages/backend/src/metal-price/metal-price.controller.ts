import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MetalPriceService } from './metal-price.service';
import { CreateMetalPriceDto } from './dto/create-metal-price.dto';
import { UpdateMetalPriceDto } from './dto/update-metal-price.dto';
@Controller('metal-price')
export class MetalPriceController {
  constructor(private readonly metalPriceService: MetalPriceService) {}

  @Post()
  create(@Req() data) {
    return this.metalPriceService.create(data);
  }

  @Get(':id')
  async getPrice(@Param('id') id) {
    this.metalPriceService.updatePrices();
    return [
      (await this.metalPriceService.getPrice('1'))[0],
      (await this.metalPriceService.getPrice('2'))[0],
      (await this.metalPriceService.getPrice('3'))[0],
    ];
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMetalPriceDto: UpdateMetalPriceDto,
  ) {
    return this.metalPriceService.update(+id, updateMetalPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metalPriceService.remove(+id);
  }

  @Post('price')
  metalPrice() {
    return this.metalPriceService.updatePrices();
  }
}

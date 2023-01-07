import { PartialType } from '@nestjs/mapped-types';
import { CreateMetalPriceDto } from './create-metal-price.dto';

export class UpdateMetalPriceDto extends PartialType(CreateMetalPriceDto) {}

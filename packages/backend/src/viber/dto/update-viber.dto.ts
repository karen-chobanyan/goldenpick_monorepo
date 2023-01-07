import { PartialType } from '@nestjs/mapped-types';
import { CreateViberDto } from './create-viber.dto';

export class UpdateViberDto extends PartialType(CreateViberDto) {}

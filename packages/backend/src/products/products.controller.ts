import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { ProductsService } from './products.service';
import { FilesService } from 'src/files/files.service';
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createProduct(@Body() data, @CurrentUser() user) {
    data.owner = !user.owner ? user._id : user.owner;
    let product;
    if (!data._id) {
      data.productMetals = this.saveMetals(data);
      data.productGems = this.saveGems(data);
      const imgs = data.images.length
        ? await this.filesService.upload(data.images, user)
        : [];
      const attachments = data.attachments.length
        ? await this.filesService.upload(data.attachments, user)
        : [];

      data.images = imgs;
      data.attachments = attachments;
      data.owner = !user.owner ? user._id : user.owner;

      product = await this.productService.create(data);
    } else {
      data.productGems = this.saveGems(data);
      data.productMetals = this.saveMetals(data);
      const imgs = await this.filesService.upload(data.images, user);
      if (imgs.length) {
        data.images = imgs;
      }
      const attachments = await this.filesService.upload(
        data.attachments,
        user,
      );
      if (attachments.length) {
        data.attachments = attachments;
      }
      product = await this.productService.update(data);
    }
    return product;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProducts(@Req() data, @CurrentUser() user) {
    const product = await this.productService.get();
    return product;
  }

  @Get(':id')
  async getMetal(@Param('id') id) {
    return await this.productService.getProduct(id);
  }

  saveMetals = (data) => {
    const metalsArray = data.productMetals.filter(
      (item) => item !== null && item.metal !== null,
    );
    return metalsArray;
  };

  saveGems = (data) => {
    const gemsArray = data.productGems.filter((item) => item.gem !== null);
    return gemsArray;
  };

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteGem(@Body() data, @CurrentUser() user) {
    const product = await this.productService.delete(data);
    return product;
  }
}

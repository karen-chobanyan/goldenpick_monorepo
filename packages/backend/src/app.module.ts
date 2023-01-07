import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as mongoconfig from './mongoconfig';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProductsModule } from './products/products.module';
import { GemsModule } from './gems/gems.module';
import { MetalsModule } from './metals/metals.module';
import { FilesModule } from './files/files.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { MetalPriceModule } from './metal-price/metal-price.module';
import { ViberModule } from './viber/viber.module';
import { SettingsModule } from './settings/settings.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    AuthModule,
    TypeOrmModule.forRoot(mongoconfig),
    DashboardModule,
    ContactsModule,
    ProductsModule,
    RolesModule,
    OrdersModule,
    GemsModule,
    MetalsModule,
    FilesModule,
    ProductCategoriesModule,
    MetalPriceModule,
    SettingsModule,
    ViberModule,
  ],
  controllers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [UsersModule, SuppliersModule, CategoriesModule, ProductsModule, OrdersModule, CampaignsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

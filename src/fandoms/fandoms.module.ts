import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FandomsService } from './fandoms.service';
import { FandomsController } from './fandoms.controller';
import { Fandom } from './entities/fandom.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fandom, Product])],
  controllers: [FandomsController],
  providers: [FandomsService],
  exports: [FandomsService],
})
export class FandomsModule { }

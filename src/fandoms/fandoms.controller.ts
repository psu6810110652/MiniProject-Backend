import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FandomsService } from './fandoms.service';
import { CreateFandomDto, UpdateFandomDto } from './dto/create-fandom.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('fandoms')
export class FandomsController {
  constructor(private readonly fandomsService: FandomsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createFandomDto: CreateFandomDto, @Request() req) {
    console.log("DEBUG: Create Fandom Request User:", req.user);
    const creatorId = req.user.userId || req.user.id || req.user.sub;

    if (!creatorId) {
      console.error("CRITICAL: No User ID found in request for creating fandom");
    }

    return this.fandomsService.create(createFandomDto, creatorId);
  }

  @Get()
  findAll() {
    return this.fandomsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.fandomsService.search(query);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.fandomsService.findByCategory(category);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.fandomsService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fandomsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateFandomDto: UpdateFandomDto) {
    return this.fandomsService.update(id, updateFandomDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.fandomsService.remove(id);
  }

  @Patch(':id/product-count')
  updateProductCount(@Param('id') id: string, @Body('count') count: number) {
    return this.fandomsService.updateProductCount(id, count);
  }

  @Patch(':id/member-count')
  updateMemberCount(@Param('id') id: string, @Body('count') count: number) {
    return this.fandomsService.updateMemberCount(id, count);
  }
}

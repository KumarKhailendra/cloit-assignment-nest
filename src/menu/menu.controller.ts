import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'Create a menu item' })
  @ApiBody({ schema: { properties: { name: { type: 'string' }, parentId: { type: 'string', nullable: true } } } })
  @Post()
  async create(@Body() data: { name: string; parentId?: string }) {
    return this.menuService.create(data.name, data.parentId);
  }

  @ApiOperation({ summary: 'Update a menu item' })
  @ApiParam({ name: 'id', type: 'string', description: 'Menu item ID' })
  @ApiBody({ schema: { properties: { name: { type: 'string' }, parentId: { type: 'string', nullable: true } } } })
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: { name: string; parentId?: string }) {
    return this.menuService.update(id, data.name, data.parentId);
  }

  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiParam({ name: 'id', type: 'string', description: 'Menu item ID' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.menuService.delete(id);
  }

  @ApiOperation({ summary: 'Get the nested menu structure' })
  @Get()
  async getNestedMenu() {
    return this.menuService.getAllMenu();
  }

  @ApiOperation({ summary: 'Get nested menu by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Menu item ID' })
  @Get(':id')
  async getNestedMenuById(@Param('id') id: string) {
    return this.menuService.getNestedMenuById(id);
  }
}

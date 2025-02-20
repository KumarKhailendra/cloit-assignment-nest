import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaModule } from '../prisma.module'; // 👈 Import PrismaModule

@Module({
  imports: [PrismaModule], // 👈 Add PrismaModule to imports
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}

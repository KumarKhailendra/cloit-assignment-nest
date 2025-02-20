/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 Makes PrismaService available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 Export PrismaService so other modules can use it
})
export class PrismaModule {}

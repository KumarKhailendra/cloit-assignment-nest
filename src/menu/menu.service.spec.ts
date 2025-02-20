/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma.service';

describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuService, PrismaService],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a menu item', async () => {
    const createSpy = jest.spyOn(prisma.menuItem, 'create').mockResolvedValue({
      id: '1',
      name: 'Main Menu',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create('Main Menu');
    expect(createSpy).toHaveBeenCalled();
    expect(result.name).toBe('Main Menu');
  });

  it('should return a nested menu structure', async () => {
    jest.spyOn(prisma.menuItem, 'findMany').mockResolvedValue([
      {
        id: '1',
        name: 'Main Menu',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '2',
            name: 'Sub Menu',
            parentId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
            children: [],
          },
        ],
      },
    ] as any);

    const result = await service.getNestedMenu();
    expect(result.items.length).toBe(1);
    expect(result.items[0].name).toBe('Main Menu');
    expect(result.items[0].children.length).toBe(1);
  });
});

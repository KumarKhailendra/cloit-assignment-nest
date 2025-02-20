/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1', name: 'Main Menu', parentId: null }),
            getNestedMenu: jest.fn().mockResolvedValue({
              menuName: 'System All',
              items: [{ id: '1', name: 'Main Menu', children: [] }],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a menu item', async () => {
    const result = await controller.create({ name: 'Main Menu' });
    expect(result.name).toBe('Main Menu');
  });
});

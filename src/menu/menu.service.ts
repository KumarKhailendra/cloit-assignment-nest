/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MenuItem } from '@prisma/client';

@Injectable()
export class MenuService {
    constructor(private prisma: PrismaService) { }

    async create(name: string, parentId?: string): Promise<MenuItem> {
        return this.prisma.menuItem.create({
            data: { name, parentId: parentId || null },
        });
    }

    async update(id: string, name: string, parentId?: string): Promise<MenuItem> {
        return this.prisma.menuItem.update({
            where: { id },
            data: { name, parentId: parentId || null },
        });
    }

    async delete(id: string): Promise<MenuItem> {
        return this.prisma.menuItem.delete({ where: { id } });
    }

    async getNestedMenu(): Promise<any> {
        const buildTree = async (parentId: string | null = null): Promise<any[]> => {
            const items = await this.prisma.menuItem.findMany({
                where: { parentId },
            });

            return Promise.all(
                items.map(async (item) => ({
                    id: item.id,
                    name: item.name,
                    children: await buildTree(item.id),
                }))
            );
        };
        const responceItems = await buildTree();
        return [...responceItems];
    }

    async getNestedMenuById(id: string): Promise<any> {
        const findRootMenuIdAndDepth = async (menuId: string): Promise<{ rootMenuId: string; depth: number }> => {
            let currentItem = await this.prisma.menuItem.findFirst({ where: { id: menuId } });
            let depth = 0;

            while (currentItem?.parentId) {
                currentItem = await this.prisma.menuItem.findFirst({ where: { id: currentItem.parentId } });
                depth++;
            }

            return {
                rootMenuId: currentItem?.id ?? menuId, // Root menu ID (or itself if it's root)
                depth, // Depth from root
            };
        };

        const buildTree = async (parentId: string) => {
            const items = await this.prisma.menuItem.findMany({
                where: { parentId },
            });

            return Promise.all(
                items.map(async (item) => ({
                    id: item.id,
                    name: item.name,
                    depth: (await findRootMenuIdAndDepth(item.id)).depth,
                    children: await buildTree(item.id),
                }))
            );
        };

        const currentItems = await this.prisma.menuItem.findFirst({
            where: { id },
        });
        let perentItems = null
        if (currentItems.parentId) {
            perentItems = await this.prisma.menuItem.findFirst({
                where: { id: currentItems.parentId },
            });
        }

        const { rootMenuId, depth } = await findRootMenuIdAndDepth(id);

        const responceItems = {
            id: currentItems.id,
            name: currentItems.name,
            parentId: perentItems?.id || '',
            perentName: perentItems?.name || '',
            rootMenuId,
            depth,
            children: await buildTree(id)
        };
        return responceItems;
    }

    async getAllMenu(): Promise<MenuItem[]> {
        return this.prisma.menuItem.findMany({
            where: { parentId: null },
        });
    }
}

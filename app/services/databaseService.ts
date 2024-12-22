// app/services/databaseService.ts

import { Storage } from "@/app/models/schema";
import { Item } from "@/app/models/schema";
import { ShopListItem } from "@/app/models/schema";

// Simple ID generator function
const generateId = (): string => {
  return Date.now().toString() + Math.floor(Math.random() * 1000000).toString();
};

export const DatabaseService = {
  items: {
    async create(data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
      const items = await Storage.items.getAll();
      const newItem: Item = {
        id: generateId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      items.push(newItem);
      await Storage.items.save(items);
      return newItem;
    },

    async getAll(): Promise<Item[]> {
      return Storage.items.getAll();
    },


async delete(id: string): Promise<void> {
  const items = await Storage.items.getAll();
  const filteredItems = items.filter(item => item.id !== id);
  await Storage.items.save(filteredItems);
},

    async search(query: string): Promise<Item[]> {
      const items = await Storage.items.getAll();
      return items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  shopList: {
    async addItem(item: Omit<ShopListItem, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Promise<ShopListItem> {
      const items = await Storage.shopList.getAll();
      const newItem: ShopListItem = {
        id: generateId(),
        ...item,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      items.push(newItem);
      await Storage.shopList.save(items);
      return newItem;
    },

    async getAll(): Promise<ShopListItem[]> {
      return Storage.shopList.getAll();
    },

    async toggleComplete(id: string): Promise<void> {
      const items = await Storage.shopList.getAll();
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { ...item, completed: !item.completed, updatedAt: new Date() };
        }
        return item;
      });
      await Storage.shopList.save(updatedItems);
    },

    async delete(id: string): Promise<void> {
      const items = await Storage.shopList.getAll();
      const filteredItems = items.filter(item => item.id !== id);
      await Storage.shopList.save(filteredItems);
    }
  }
};
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
    },

    async save(items: Item[]): Promise<void> {
      await Storage.items.save(items);
    },

    async update(id: string, data: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item> {
      const items = await Storage.items.getAll();
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error(`Item with id ${id} not found`);
      }

      const updatedItem = {
        ...items[index],
        ...data,
        updatedAt: new Date()
      };

      items[index] = updatedItem;
      await Storage.items.save(items);
      return updatedItem;
    }
  },

  shopList: {
    async addItem(item: Omit<ShopListItem, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Promise<ShopListItem> {
      //console.log('Adding item with image:', item.imagePath); 
      const items = await Storage.shopList.getAll();
      const newItem: ShopListItem = {
        id: generateId(),
        ...item,
        imagePath: item.imagePath, // Explicitly include imagePath
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      //console.log('New item created:', newItem);
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

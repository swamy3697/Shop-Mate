import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Item {
  id: string;
  name: string;
  imagePath?: string;
  quantity: number;
  quantityType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopListItem {
  id: string;
  name: string;
  imagePath?: string;
  quantity: number;
  quantityType: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}

const ITEMS_STORAGE_KEY = '@items';
const SHOP_LIST_STORAGE_KEY = '@shopList';

export const Storage = {
  items: {
    async getAll(): Promise<Item[]> {
      const data = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    },

    async save(items: Item[]): Promise<void> {
      await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    }
  },
  shopList: {
    async getAll(): Promise<ShopListItem[]> {
      const data = await AsyncStorage.getItem(SHOP_LIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    },

    async save(items: ShopListItem[]): Promise<void> {
      await AsyncStorage.setItem(SHOP_LIST_STORAGE_KEY, JSON.stringify(items));
    }
  }
};
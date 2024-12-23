export  interface Item {
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
    itemId: string;
    quantity: number;
    quantityType: string;
    createdAt: Date;
    updatedAt: Date;
    completed: boolean;
  }

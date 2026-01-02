
export type Role = 'ADMIN' | 'STORE_KEEPER' | 'VIEWER';

export interface User {
  username: string;
  role: Role;
  lastLogin?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  unit: string;
  minStock: number;
  currentStock: number;
  notes: string;
}

export type TransactionType = 'RECEIPT' | 'ISSUANCE';

export interface Transaction {
  id: string;
  type: TransactionType;
  itemId: string;
  quantity: number;
  department?: string; // For issuance
  supplier?: string;   // For receipt
  orderNumber?: string;
  date: string;
  timestamp: string;
  user: string;
  notes: string;
}

export interface PurchaseOrder {
  id: string;
  items: { itemId: string; quantity: number }[];
  date: string;
  status: 'DRAFT' | 'SENT';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
  timestamp: string;
  read: boolean;
}

export interface DatabaseState {
  users: User[];
  categories: Category[];
  items: Item[];
  transactions: Transaction[];
  purchaseOrders: PurchaseOrder[];
  notifications: AppNotification[];
}

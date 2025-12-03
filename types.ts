export enum UserRole {
    ADMIN = 'admin',
    LOGISTICS = 'logistics',
    SALES = 'sales',
    VIEWER = 'viewer',
  }
  
  export enum ShipmentStatus {
    IN_TRANSIT = 'In Transit',
    DELIVERED = 'Delivered',
    PENDING = 'Pending',
    CUSTOMS = 'Customs',
  }
  
  export enum ProductCategory {
    POULTRY = 'Poultry',
    PORK = 'Pork',
    BEEF = 'Beef',
    SEAFOOD = 'Seafood',
    VEGETABLES = 'Vegetables',
    FRIES = 'Fries',
  }
  
  export interface Profile {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    role: UserRole;
    created_at: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    stock_level: number;
    unit: string;
    location: string;
    created_at: string;
  }
  
  export interface Shipment {
    id: string;
    tracking_number: string;
    origin: string;
    destination: string;
    status: ShipmentStatus;
    product_name: string;
    eta: string;
    created_at: string;
  }
  
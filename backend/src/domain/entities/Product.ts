export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

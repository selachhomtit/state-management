export type ProductResponse = {
    id: number;
    title: string; 
    slug: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
    creationAt: string;
    updatedAt: string;
  };

export type Category = {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string;
}
export interface CartProps {
  id: string;
  title: string;
  price: number;
  image?: string;
  onAddToCart: (productId: string) => void;
}

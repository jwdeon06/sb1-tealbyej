import type { FC } from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
        <button 
          onClick={onAddToCart} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
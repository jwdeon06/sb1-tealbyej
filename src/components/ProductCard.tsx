import type { FC } from 'react';
import type { Product } from '../types/index';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatCurrency } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAdminActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showAdminActions,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="overflow-hidden">
      {product.images?.[0] && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <Badge
            variant={product.category === 'Product' ? 'primary' : 'secondary'}
            className="absolute top-2 right-2"
          >
            {product.category}
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
          
          {onAddToCart && (
            <Button onClick={() => onAddToCart(product)}>
              Add to Cart
            </Button>
          )}
        </div>

        {product.category === 'Product' && (
          <p className="text-sm text-gray-500">
            Stock: {product.stock} units
          </p>
        )}

        {showAdminActions && (
          <div className="flex justify-end space-x-2 pt-2 border-t">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                onClick={() => onDelete(product)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
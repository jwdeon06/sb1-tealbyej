import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createCheckoutSession } from '../services/stripe';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async () => {
    try {
      await createCheckoutSession(items);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process');
    }
  };

  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <Button onClick={() => navigate('/store')}>
          Continue Shopping
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader title="Shopping Cart" />

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.product.id}>
            <div className="flex items-center gap-4">
              {item.product.images[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">{formatCurrency(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="danger"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Card>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/store')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={handleCheckout}
              className="flex-1"
            >
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
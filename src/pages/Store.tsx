import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/products';
import { Product } from '../types/index';
import { PageHeader } from '../components/layout/PageHeader';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import toast from 'react-hot-toast';

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const physicalProducts = products.filter(p => p.category === 'Product');
  const services = products.filter(p => p.category === 'Service');

  return (
    <div>
      <PageHeader
        title="Store"
        description="Browse our selection of products and services"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicalProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          {physicalProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="services">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ProductCard
                key={service.id}
                product={service}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
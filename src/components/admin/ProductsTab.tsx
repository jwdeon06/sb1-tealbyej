import { useState, type FC } from 'react';
import type { Product } from '../../types/index';
import ProductEditor from '../ProductEditor';
import { deleteProduct } from '../../services/products';
import toast from 'react-hot-toast';

interface ProductsTabProps {
  products: Product[];
  onRefresh: () => void;
};

const ProductsTab: FC<ProductsTabProps> = ({ products, onRefresh }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Product' | 'Service' | ''>('');

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold">Products & Services</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as 'Product' | 'Service' | '')}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">All Items</option>
            <option value="Product">Products</option>
            <option value="Service">Services</option>
          </select>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Add New Item
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  product.category === 'Product' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {product.category === 'Product' && (
                <div className="mt-2 text-sm text-gray-500">
                  Stock: {product.stock} units
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No items found.</p>
        </div>
      )}

      {(showEditor || editingProduct) && (
        <ProductEditor
          product={editingProduct}
          onSave={() => {
            setShowEditor(false);
            setEditingProduct(null);
            onRefresh();
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
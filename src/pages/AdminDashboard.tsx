import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllProducts } from '../services/products';
import { getAllUsers } from '../services/userService';
import { getAllPosts, deletePost } from '../services/posts';
import { Product, UserProfile } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import ProductEditor from '../components/ProductEditor';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, usersData, postsData] = await Promise.all([
        getAllProducts(),
        getAllUsers(),
        getAllPosts()
      ]);
      
      setProducts(productsData);
      setUsers(usersData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <p className="text-red-600 text-lg mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage your store's products, users, and settings"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Products & Services</h2>
              <Button onClick={() => setEditingProduct({} as Product)}>
                Add New Item
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {editingProduct !== null && (
            <ProductEditor
              product={editingProduct.id ? editingProduct : null}
              onSave={() => {
                loadData();
                setEditingProduct(null);
              }}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Library Posts</h2>
              <Button onClick={() => navigate('/create-post')}>
                Add New Post
              </Button>
            </div>

            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        By {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this post?')) {
                            try {
                              await deletePost(post.id);
                              loadData();
                              toast.success('Post deleted successfully');
                            } catch (error) {
                              console.error('Error deleting post:', error);
                              toast.error('Failed to delete post');
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts found.</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.uid}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
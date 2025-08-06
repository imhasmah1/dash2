import { useState } from 'react';
import { useData, Order, OrderItem } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, ShoppingCart, User, Package, Minus, Eye, Phone, MapPin, Clock } from 'lucide-react';

export default function Orders() {
  const { orders, customers, products, addOrder, updateOrder, deleteOrder, updateOrderStatus, getCustomerById, getProductById, getVariantById } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [] as OrderItem[],
    status: 'processing' as Order['status'],
    deliveryType: 'delivery' as Order['deliveryType'],
    notes: ''
  });

  const filteredOrders = orders.filter(order => {
    const customer = getCustomerById(order.customerId);
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const resetForm = () => {
    setFormData({ customerId: '', items: [], status: 'processing', deliveryType: 'delivery', notes: '' });
    setEditingOrder(null);
  };

  const openDialog = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customerId: order.customerId,
        items: [...order.items],
        status: order.status,
        deliveryType: order.deliveryType,
        notes: order.notes || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const openViewDialog = (order: Order) => {
    setViewingOrder(order);
    setIsViewDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingOrder(null);
  };

  const addProductToOrder = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', variantId: 'no-variant', quantity: 1, price: 0 }]
    }));
  };

  const removeProductFromOrder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'productId') {
            const product = getProductById(value as string);
            if (product) {
              updatedItem.price = product.price;
              updatedItem.variantId = 'no-variant'; // Reset variant when product changes
            }
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || formData.items.length === 0) {
      alert('Please select a customer and add at least one product');
      return;
    }

    try {
      const orderData = {
        ...formData,
        total: calculateTotal()
      };

      if (editingOrder) {
        await updateOrder(editingOrder.id, orderData);
      } else {
        await addOrder(orderData);
      }
      closeDialog();
    } catch (error) {
      alert('Failed to save order. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
      } catch (error) {
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailableVariants = (productId: string) => {
    const product = getProductById(productId);
    return product?.variants || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders with detailed tracking and delivery information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="bg-dashboard-primary hover:bg-dashboard-primary-light">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Edit Order' : 'Create New Order'}
              </DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update order details below.' : 'Select a customer and add products to create a new order.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Products</Label>
                  <div className="space-y-4">
                    {formData.items.map((item, index) => {
                      const product = getProductById(item.productId);
                      const availableVariants = getAvailableVariants(item.productId);
                      const selectedVariant = (item.variantId && item.variantId !== 'no-variant') ? getVariantById(item.productId, item.variantId) : null;
                      
                      return (
                        <div key={index} className="flex gap-2 items-end p-4 border rounded-lg">
                          <div className="flex-1">
                            <Label>Product</Label>
                            <Select 
                              value={item.productId} 
                              onValueChange={(value) => updateOrderItem(index, 'productId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - ${product.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {availableVariants.length > 0 && (
                            <div className="flex-1">
                              <Label>Variant</Label>
                              <Select
                                value={item.variantId || 'no-variant'}
                                onValueChange={(value) => updateOrderItem(index, 'variantId', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select variant" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no-variant">No variant</SelectItem>
                                  {availableVariants.map((variant) => (
                                    <SelectItem key={variant.id} value={variant.id}>
                                      {variant.name} (Stock: {variant.stock})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          <div className="w-24">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              max={selectedVariant ? selectedVariant.stock : product?.totalStock || 999}
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="w-24">
                            <Label>Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeProductFromOrder(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addProductToOrder}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: Order['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="picked-up">Picked Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="deliveryType">Delivery Type</Label>
                    <Select value={formData.deliveryType} onValueChange={(value: Order['deliveryType']) => setFormData(prev => ({ ...prev, deliveryType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Special instructions or notes..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold text-dashboard-primary">
                    BD {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-primary-light">
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders by ID, customer, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const customer = getCustomerById(order.customerId);
          return (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-dashboard-primary rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {customer?.name || 'Unknown Customer'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-dashboard-primary">
                      BD {order.total.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Select
                        value={order.status}
                        onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="picked-up">Picked Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Products ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => {
                        const product = getProductById(item.productId);
                        const variant = (item.variantId && item.variantId !== 'no-variant') ? getVariantById(item.productId, item.variantId) : null;
                        return (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span>
                              {product?.name || 'Unknown Product'}
                              {variant && ` (${variant.name})`}
                            </span>
                            <span className="text-sm text-gray-600">
                              {item.quantity}x BD {item.price.toFixed(2)} = BD {(item.quantity * item.price).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-600 text-center">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="capitalize font-medium text-dashboard-primary">
                        {order.deliveryType}
                      </span>
                      <span>Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openViewDialog(order)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openDialog(order)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details #{viewingOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete order information for delivery and tracking
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                {(() => {
                  const customer = getCustomerById(viewingOrder.customerId);
                  return customer ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {customer.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">Phone:</span> {customer.phone}
                      </div>
                      <div className="md:col-span-2 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <div>
                          <span className="font-medium">Delivery Address:</span>
                          <p>{customer.address}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-600">Customer not found</p>
                  );
                })()}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, index) => {
                    const product = getProductById(item.productId);
                    const variant = (item.variantId && item.variantId !== 'no-variant') ? getVariantById(item.productId, item.variantId) : null;
                    return (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <span className="font-medium">
                            {product?.name || 'Unknown Product'}
                          </span>
                          {variant && (
                            <span className="text-sm text-gray-600 ml-2">({variant.name})</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div>
                            {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                          <div className="font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Status:</span>
                  <Badge className={getStatusColor(viewingOrder.status)}>
                    {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Created:</span>
                  <span>{new Date(viewingOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span>Last Updated:</span>
                  <span>{new Date(viewingOrder.updatedAt).toLocaleString()}</span>
                </div>
                {viewingOrder.notes && (
                  <div className="mb-3">
                    <span className="font-medium">Notes:</span>
                    <p className="text-gray-600 mt-1">{viewingOrder.notes}</p>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-2xl font-bold text-dashboard-primary">
                    ${viewingOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeViewDialog}>
              Close
            </Button>
            <Button onClick={() => {
              closeViewDialog();
              if (viewingOrder) openDialog(viewingOrder);
            }}>
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first order'}
            </p>
            <Button 
              className="mt-4 bg-dashboard-primary hover:bg-dashboard-primary-light"
              onClick={() => openDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { DollarSign, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'processing':
      return 'text-blue-700 bg-blue-100';
    case 'ready':
      return 'text-yellow-700 bg-yellow-100';
    case 'delivered':
      return 'text-green-700 bg-green-100';
    case 'picked-up':
      return 'text-purple-700 bg-purple-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export default function Dashboard() {
  const { orders, customers, products, getCustomerById, getProductById } = useData();
  const { t } = useLanguage();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingOrders = orders.filter(order => order.status === 'processing').length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `BD ${totalRevenue.toFixed(2)}`,
      description: `From ${orders.length} orders`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      description: `${customers.length} customers`,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Avg Order Value',
      value: `BD ${avgOrderValue.toFixed(2)}`,
      description: `Across all orders`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Processing Orders',
      value: pendingOrders.toString(),
      description: 'Need attention',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(order => {
      const customer = getCustomerById(order.customerId);
      const mainProduct = order.items[0] ? getProductById(order.items[0].productId) : null;
      const itemsCount = order.items.length;
      return {
        id: `#${order.id}`,
        customer: customer?.name || 'Unknown Customer',
        product: itemsCount > 1 ? `${mainProduct?.name || 'Product'} +${itemsCount - 1} more` : (mainProduct?.name || 'Unknown Product'),
        amount: `BD ${order.total.toFixed(2)}`,
        status: order.status === 'picked-up' ? 'Picked Up' : order.status.charAt(0).toUpperCase() + order.status.slice(1),
        date: new Date(order.createdAt).toISOString().split('T')[0]
      };
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Recent Orders</CardTitle>
          <CardDescription>
            Latest orders from your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Products</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-dashboard-primary">{order.id}</td>
                      <td className="py-3 px-4 text-gray-900">{order.customer}</td>
                      <td className="py-3 px-4 text-gray-600">{order.product}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet. Create your first order to see it here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

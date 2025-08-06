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

const getStatusText = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'processing':
      return t('orders.processing');
    case 'ready':
      return t('orders.ready');
    case 'delivered':
      return t('orders.delivered');
    case 'picked-up':
      return t('orders.pickedUp');
    default:
      return status;
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
      title: t('dashboard.totalRevenue'),
      value: `BD ${totalRevenue.toFixed(2)}`,
      description: `${t('dashboard.totalOrders')}: ${orders.length}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t('dashboard.totalOrders'),
      value: orders.length.toString(),
      description: `${customers.length} ${t('nav.customers')}`,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t('revenue.avgOrderValue'),
      value: `BD ${avgOrderValue.toFixed(2)}`,
      description: t('orders.orderTotal'),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: t('orders.processing'),
      value: pendingOrders.toString(),
      description: t('orders.processing'),
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
        status: getStatusText(order.status, t),
        date: new Date(order.createdAt).toISOString().split('T')[0]
      };
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-2">{t('dashboard.welcome')}</p>
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
          <CardTitle className="text-xl font-semibold text-gray-900">{t('dashboard.recentOrders')}</CardTitle>
          <CardDescription>
            {t('dashboard.recentOrders')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('orders.orderId')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('orders.customer')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('nav.products')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('orders.total')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('orders.status')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('orders.date')}</th>
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

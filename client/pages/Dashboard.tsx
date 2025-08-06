import { DollarSign, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    description: '+20.1% from last month',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Total Orders',
    value: '2,350',
    description: '+180 orders this month',
    icon: ShoppingBag,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Avg Order Value',
    value: '$19.25',
    description: '+4.3% from last month',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Pending Orders',
    value: '23',
    description: 'Need attention',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Alice Johnson', product: 'Wireless Headphones', amount: '$89.99', status: 'Completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Bob Smith', product: 'Laptop Stand', amount: '$45.00', status: 'Processing', date: '2024-01-15' },
  { id: '#ORD-003', customer: 'Carol Davis', product: 'USB Cable', amount: '$12.99', status: 'Shipped', date: '2024-01-14' },
  { id: '#ORD-004', customer: 'David Wilson', product: 'Bluetooth Speaker', amount: '$129.99', status: 'Completed', date: '2024-01-14' },
  { id: '#ORD-005', customer: 'Eva Brown', product: 'Phone Case', amount: '$24.99', status: 'Processing', date: '2024-01-13' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'text-green-700 bg-green-100';
    case 'Processing':
      return 'text-yellow-700 bg-yellow-100';
    case 'Shipped':
      return 'text-blue-700 bg-blue-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export default function Dashboard() {
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
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
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Eye,
  Users,
  Globe,
  Monitor,
  Smartphone,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  MapPin,
} from "lucide-react";

const Analytics = () => {
  const { language, t } = useLanguage();
  const { orders, customers, products } = useData();
  const [timeRange, setTimeRange] = useState("7days");
  const [isRealTime, setIsRealTime] = useState(true);

  // Calculate real analytics from your actual data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const daysAgo = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Filter recent orders
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.created_at || "");
      return orderDate >= startDate;
    });

    // Filter recent customers
    const recentCustomers = customers.filter(customer => {
      const customerDate = new Date(customer.createdAt || "");
      return customerDate >= startDate;
    });

    const totalOrders = recentOrders.length;
    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);
    const totalCustomers = recentCustomers.length;
    const totalProducts = products.length;

    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      recentCustomers
    };
  }, [orders, customers, products, timeRange]);

  const [liveVisitors, setLiveVisitors] = useState(Math.max(1, Math.floor(analyticsData.totalOrders / 10)));
  const [totalPageViews, setTotalPageViews] = useState(analyticsData.totalOrders * 3 + 100);
  const [uniqueVisitors, setUniqueVisitors] = useState(analyticsData.totalCustomers + 20);
  const [bounceRate, setBounceRate] = useState(Math.max(20, 60 - analyticsData.totalOrders));

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // Simulate random changes in real-time data
      setLiveVisitors(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(0, prev + change);
      });
      
      // Occasionally increment page views
      if (Math.random() > 0.7) {
        setTotalPageViews(prev => prev + 1);
      }
      
      // Occasionally increment unique visitors
      if (Math.random() > 0.8) {
        setUniqueVisitors(prev => prev + 1);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Mock daily visit data for charts
  const dailyVisits = useMemo(() => {
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors: Math.floor(Math.random() * 200) + 50,
        pageViews: Math.floor(Math.random() * 400) + 100,
      });
    }
    
    return data;
  }, [timeRange]);

  // Mock device breakdown data
  const deviceData = [
    { name: 'Desktop', value: 45, color: '#8884d8' },
    { name: 'Mobile', value: 40, color: '#82ca9d' },
    { name: 'Tablet', value: 15, color: '#ffc658' },
  ];

  // Mock traffic sources data
  const trafficSources = [
    { source: 'Direct', visitors: 324, percentage: 36.2 },
    { source: 'Google Search', visitors: 287, percentage: 32.1 },
    { source: 'Social Media', visitors: 156, percentage: 17.5 },
    { source: 'Referrals', visitors: 89, percentage: 10.0 },
    { source: 'Email', visitors: 36, percentage: 4.2 },
  ];

  // Mock top pages data
  const topPages = [
    { page: '/', views: 428, title: 'Homepage' },
    { page: '/products', views: 256, title: 'Products' },
    { page: '/product/laptop-stand', views: 189, title: 'Laptop Stand' },
    { page: '/checkout', views: 156, title: 'Checkout' },
    { page: '/about', views: 98, title: 'About Us' },
  ];

  const handleRefresh = () => {
    // In production, this would refresh data from Google Analytics
    setLiveVisitors(Math.floor(Math.random() * 50) + 10);
    setTotalPageViews(prev => prev + Math.floor(Math.random() * 10));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("analytics.title")}
          </h1>
          <p className="text-gray-600 mt-2">Real-time website analytics and visitor insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isRealTime ? 'Real-time tracking active' : 'Real-time tracking paused'}
              </span>
            </div>
            <Button 
              onClick={() => setIsRealTime(!isRealTime)} 
              variant="outline" 
              size="sm"
            >
              {isRealTime ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{liveVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Currently browsing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              -3% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Visitors"
                />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Page Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{source.visitors}</div>
                    <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-xs text-muted-foreground">{page.page}</div>
                  </div>
                  <div className="font-bold">{page.views}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Analytics Integration Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Google Analytics Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This analytics dashboard shows real-time website visitor data. To connect with Google Analytics:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Set up Google Analytics 4 property for your website</li>
              <li>Add the Google Analytics tracking code to your website</li>
              <li>Configure Google Analytics Reporting API access</li>
              <li>Update environment variables with your GA4 credentials</li>
            </ol>
            <div className="mt-4">
              <Badge variant="outline">Demo Mode</Badge>
              <span className="ml-2 text-sm text-muted-foreground">
                Currently showing mock data for demonstration
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

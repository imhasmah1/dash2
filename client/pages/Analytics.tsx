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
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  newUsers: number;
  returningUsers: number;
}

interface VisitorTrend {
  date: string;
  visitors: number;
  pageViews: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
}

interface TopPage {
  page: string;
  views: number;
  uniqueViews: number;
}

const Analytics = () => {
  const { language, isRTL, t } = useLanguage();
  const { orders, customers, products } = useData();
  const [timeRange, setTimeRange] = useState("7days");

  // Calculate real analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const daysAgo = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Filter orders within time range
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.created_at || '');
      return orderDate >= startDate;
    });

    // Filter customers within time range
    const recentCustomers = customers.filter(customer => {
      const customerDate = new Date(customer.createdAt || customer.created_at || '');
      return customerDate >= startDate;
    });

    const totalOrders = recentOrders.length;
    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      visitors: customers.length * 3, // Estimate: assume 3 visits per customer
      pageViews: customers.length * 8, // Estimate: assume 8 page views per customer
      averageSessionDuration: Math.floor(avgOrderValue * 2), // Rough estimate based on order value
      bounceRate: Math.max(20, 60 - Math.floor(totalOrders / customers.length * 100)),
      newUsers: recentCustomers.length,
      returningUsers: Math.max(0, customers.length - recentCustomers.length),
    };
  }, [orders, customers, timeRange]);

  const [visitorTrends, setVisitorTrends] = useState<VisitorTrend[]>([
    { date: "2024-01-01", visitors: 245, pageViews: 1245 },
    { date: "2024-01-02", visitors: 323, pageViews: 1567 },
    { date: "2024-01-03", visitors: 298, pageViews: 1423 },
    { date: "2024-01-04", visitors: 367, pageViews: 1789 },
    { date: "2024-01-05", visitors: 445, pageViews: 2134 },
    { date: "2024-01-06", visitors: 398, pageViews: 1923 },
    { date: "2024-01-07", visitors: 471, pageViews: 2266 },
  ]);

  const [deviceData, setDeviceData] = useState<DeviceData[]>([
    { device: "Mobile", visitors: 1528, percentage: 60 },
    { device: "Desktop", visitors: 764, percentage: 30 },
    { device: "Tablet", visitors: 255, percentage: 10 },
  ]);

  const [topPages, setTopPages] = useState<TopPage[]>([
    { page: "/", views: 4523, uniqueViews: 3245 },
    { page: "/products", views: 3456, uniqueViews: 2789 },
    { page: "/product/1", views: 2345, uniqueViews: 1987 },
    { page: "/product/2", views: 1987, uniqueViews: 1654 },
    { page: "/admin", views: 876, uniqueViews: 123 },
  ]);

  const colors = ["#742370", "#8b4d89", "#401951", "#5a2972", "#9d5b9a"];

  const translations = {
    en: {
      title: "Analytics",
      overview: "Overview",
      visitors: "Total Visitors",
      pageViews: "Page Views",
      avgSession: "Avg. Session Duration",
      bounceRate: "Bounce Rate",
      newUsers: "New Users",
      returningUsers: "Returning Users",
      visitorTrends: "Visitor Trends",
      deviceBreakdown: "Device Breakdown",
      topPages: "Top Pages",
      views: "Views",
      uniqueViews: "Unique Views",
      minutes: "minutes",
      refresh: "Refresh Data",
      last7days: "Last 7 Days",
      last30days: "Last 30 Days",
      last90days: "Last 90 Days",
    },
    ar: {
      title: "التحليلات",
      overview: "نظرة عامة",
      visitors: "إجمالي الزوار",
      pageViews: "مشاهدات الصفحة",
      avgSession: "متوسط مدة الجلسة",
      bounceRate: "معدل الارتداد",
      newUsers: "المستخدمين الجدد",
      returningUsers: "ا��مستخدمين العائدين",
      visitorTrends: "اتجاهات الزوار",
      deviceBreakdown: "تفصيل الأجهزة",
      topPages: "أهم الصفحات",
      views: "المشاهدات",
      uniqueViews: "المشاهدات الفريدة",
      minutes: "دقائق",
      refresh: "تحديث البيانات",
      last7days: "آخر 7 أيام",
      last30days: "آخر 30 يوم",
      last90days: "آخر 90 يوم",
    },
  };

  const currentTranslations = translations[language as keyof typeof translations] || translations.en;

  const refreshData = () => {
    // Simulate data refresh
    setAnalyticsData({
      visitors: Math.floor(Math.random() * 3000) + 2000,
      pageViews: Math.floor(Math.random() * 15000) + 10000,
      averageSessionDuration: Math.floor(Math.random() * 300) + 200,
      bounceRate: Math.floor(Math.random() * 40) + 25,
      newUsers: Math.floor(Math.random() * 2000) + 1500,
      returningUsers: Math.floor(Math.random() * 1000) + 800,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dashboard-primary auto-text">
            {currentTranslations.title}
          </h1>
          <p className="text-muted-foreground auto-text">
            {currentTranslations.overview}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{currentTranslations.last7days}</SelectItem>
              <SelectItem value="30days">{currentTranslations.last30days}</SelectItem>
              <SelectItem value="90days">{currentTranslations.last90days}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {currentTranslations.refresh}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {currentTranslations.visitors}
            </CardTitle>
            <Users className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {analyticsData.visitors.toLocaleString()}
            </div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {currentTranslations.pageViews}
            </CardTitle>
            <Eye className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {analyticsData.pageViews.toLocaleString()}
            </div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {currentTranslations.avgSession}
            </CardTitle>
            <Clock className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {Math.floor(analyticsData.averageSessionDuration / 60)}:{(analyticsData.averageSessionDuration % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-muted-foreground auto-text">
              {currentTranslations.minutes}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {currentTranslations.bounceRate}
            </CardTitle>
            <MousePointer className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {analyticsData.bounceRate}%
            </div>
            <Badge variant="outline" className="mt-1">
              -3%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="auto-text">{currentTranslations.visitorTrends}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#742370" 
                  strokeWidth={2} 
                  name={currentTranslations.visitors}
                />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#8b4d89" 
                  strokeWidth={2} 
                  name={currentTranslations.pageViews}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="auto-text">{currentTranslations.deviceBreakdown}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percentage }) => `${device} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visitors"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Types & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Types */}
        <Card>
          <CardHeader>
            <CardTitle className="auto-text">User Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { type: currentTranslations.newUsers, count: analyticsData.newUsers },
                  { type: currentTranslations.returningUsers, count: analyticsData.returningUsers },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#742370" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="auto-text">{currentTranslations.topPages}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dashboard-primary text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium auto-text">{page.page}</p>
                      <p className="text-sm text-muted-foreground auto-text">
                        {page.uniqueViews.toLocaleString()} {currentTranslations.uniqueViews}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-dashboard-primary">
                      {page.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground auto-text">
                      {currentTranslations.views}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

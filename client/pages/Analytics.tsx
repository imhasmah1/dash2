import { useState, useMemo } from "react";
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
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

const Analytics = () => {
  const { language, t } = useLanguage();
  const { orders, customers, products, refetchData } = useData();
  const [timeRange, setTimeRange] = useState("7days");

  // Calculate store analytics data
  const storeAnalytics = useMemo(() => {
    const now = new Date();
    const daysAgo =
      timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Filter orders within time range
    const recentOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.created_at || "");
      return orderDate >= startDate;
    });

    // Filter customers within time range
    const recentCustomers = customers.filter((customer) => {
      const customerDate = new Date(
        customer.createdAt || customer.created_at || "",
      );
      return customerDate >= startDate;
    });

    const totalOrders = recentOrders.length;
    const totalRevenue = recentOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    const newCustomers = recentCustomers.length;

    // Order status breakdown
    const ordersByStatus = {
      processing: recentOrders.filter(o => o.status === "processing").length,
      ready: recentOrders.filter(o => o.status === "ready").length,
      delivered: recentOrders.filter(o => o.status === "delivered").length,
      "picked-up": recentOrders.filter(o => o.status === "picked-up").length,
    };

    // Delivery type breakdown
    const deliveryTypes = {
      delivery: recentOrders.filter(o => o.deliveryType === "delivery").length,
      pickup: recentOrders.filter(o => o.deliveryType === "pickup").length,
    };

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalProducts,
      totalCustomers,
      newCustomers,
      ordersByStatus,
      deliveryTypes,
    };
  }, [orders, customers, products, timeRange]);

  // Calculate daily trends from orders
  const dailyTrends = useMemo(() => {
    const now = new Date();
    const daysAgo =
      timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const trends = [];

    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt || order.created_at || "");
        return orderDate.toDateString() === date.toDateString();
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);

      trends.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayRevenue,
      });
    }

    return trends;
  }, [orders, timeRange]);

  // Order status data for pie chart
  const statusData = [
    { name: "Processing", value: storeAnalytics.ordersByStatus.processing, color: "#3b82f6" },
    { name: "Ready", value: storeAnalytics.ordersByStatus.ready, color: "#f59e0b" },
    { name: "Delivered", value: storeAnalytics.ordersByStatus.delivered, color: "#10b981" },
    { name: "Picked Up", value: storeAnalytics.ordersByStatus["picked-up"], color: "#8b5cf6" },
  ].filter(item => item.value > 0);

  // Delivery type data for chart
  const deliveryData = [
    { type: "Delivery", count: storeAnalytics.deliveryTypes.delivery },
    { type: "Pickup", count: storeAnalytics.deliveryTypes.pickup },
  ];

  const refreshData = () => {
    refetchData();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dashboard-primary auto-text">
            {t("analytics.title")}
          </h1>
          <p className="text-muted-foreground auto-text">
            {t("analytics.overview")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t("analytics.last7days")}</SelectItem>
              <SelectItem value="30days">{t("analytics.last30days")}</SelectItem>
              <SelectItem value="90days">{t("analytics.last90days")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("analytics.refresh")}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {t("analytics.totalOrders")}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {storeAnalytics.totalOrders}
            </div>
            {storeAnalytics.totalOrders > 0 && (
              <Badge variant="secondary" className="mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {t("analytics.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              BD {storeAnalytics.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground auto-text">
              {language === "ar" ? "متوسط: د.ب " + storeAnalytics.avgOrderValue.toFixed(2) + " " + t("analytics.avgPerOrder") : "Avg: BD " + storeAnalytics.avgOrderValue.toFixed(2) + " " + t("analytics.avgPerOrder")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {t("analytics.totalCustomers")}
            </CardTitle>
            <Users className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {storeAnalytics.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground auto-text">
              +{storeAnalytics.newCustomers} {t("analytics.newInPeriod")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium auto-text">
              {t("analytics.totalProducts")}
            </CardTitle>
            <Package className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-primary">
              {storeAnalytics.totalProducts}
            </div>
            <Badge variant="outline" className="mt-1">
              {t("analytics.inStock")}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="auto-text">
              {t("analytics.dailyPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#742370"
                  strokeWidth={2}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b4d89"
                  strokeWidth={2}
                  name="Revenue (BD)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="auto-text">
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Types */}
      <Card>
        <CardHeader>
          <CardTitle className="auto-text">Delivery Method Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#742370" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

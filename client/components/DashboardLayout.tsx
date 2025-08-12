import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  BarChart3,
  LogOut,
  Menu,
  X,
  Languages,
  FolderOpen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const getNavigation = (t: (key: string) => string) => [
  { name: t("nav.dashboard"), href: "/admin/", icon: LayoutDashboard },
  { name: t("nav.products"), href: "/admin/products", icon: Package },
  {
    name: t("nav.categories") as any,
    href: "/admin/categories",
    icon: FolderOpen,
  },
  { name: t("nav.orders"), href: "/admin/orders", icon: ShoppingCart },
  { name: t("nav.customers"), href: "/admin/customers", icon: Users },
  { name: t("nav.revenue"), href: "/admin/revenue", icon: TrendingUp },
  { name: t("nav.analytics"), href: "/admin/analytics", icon: BarChart3 },
  { name: t("nav.settings"), href: "/admin/settings", icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { language, setLanguage, isRTL, t } = useLanguage();
  const location = useLocation();

  const navigation = getNavigation(t);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-80 sm:w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:transform-none",
          isRTL ? "right-0" : "left-0",
          sidebarOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200">
          <div className={cn("flex items-center gap-2 sm:gap-3 min-w-0", isRTL ? "flex-row-reverse" : "")}>
            <img
              src={
                language === "ar"
                  ? "https://cdn.builder.io/api/v1/image/assets%2F22d5611cd8c847859f0fef8105890b91%2F16a76df3c393470e995ec2718d67ab09?format=webp&width=800"
                  : "https://cdn.builder.io/api/v1/image/assets%2F22d5611cd8c847859f0fef8105890b91%2Feb0b70b9250f4bfca41dbc5a78c2ce45?format=webp&width=800"
              }
              alt="أزهار ستور - azharstore"
              className="h-6 w-6 sm:h-8 sm:w-8 object-contain flex-shrink-0"
            />
            <h1 className={cn("text-base sm:text-lg font-bold text-dashboard-primary truncate", isRTL ? "text-right" : "text-left")}>
              {t("nav.adminPanel")}
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={cn("lg:hidden text-gray-400 hover:text-gray-600 p-2 touch-manipulation", isRTL ? "-ml-2" : "-mr-2")}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3 sm:px-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center px-3 sm:px-4 py-4 sm:py-3 text-sm sm:text-sm font-medium rounded-xl transition-colors touch-manipulation [dir=rtl]:flex-row-reverse [dir=rtl]:text-right [dir=ltr]:text-left",
                      isActive
                        ? "bg-dashboard-primary text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
                    )}
                  >
                    <item.icon
                      className={cn("w-5 h-5 flex-shrink-0", isRTL ? "ml-3" : "mr-3")}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-200 space-y-2">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            className="w-full justify-start h-12 sm:h-10 touch-manipulation [dir=rtl]:justify-end [dir=rtl]:flex-row-reverse"
          >
            <Languages className={cn("w-4 h-4 flex-shrink-0", isRTL ? "ml-2" : "mr-2")} />
            <span className="truncate">{t("language.switch")}</span>
          </Button>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full justify-start h-12 sm:h-10 touch-manipulation [dir=rtl]:justify-end [dir=rtl]:flex-row-reverse"
          >
            <LogOut className={cn("w-4 h-4 flex-shrink-0", isRTL ? "ml-2" : "mr-2")} />
            <span className="truncate">{t("nav.logout")}</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 [dir=rtl]:flex-row-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-600 p-2 -ml-2 touch-manipulation"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 [dir=rtl]:text-right [dir=ltr]:text-left truncate">
              {t("dashboard.title")}
            </h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

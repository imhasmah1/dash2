import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { getProducts } from "../services/api";
import { Button } from "../components/ui/button";
import { ShoppingCart, Plus, Globe, Store as StoreIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import AddToCartDialog from "../components/AddToCartDialog";
import CartSidebar from "../components/CartSidebar";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
  totalStock: number;
}

export default function Store() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { getTotalItems, setIsCartOpen, isCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsAddToCartOpen(true);
  };

  const cartItemsCount = getTotalItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header touching the roof */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between [dir=rtl]:flex-row-reverse">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 [dir=rtl]:flex-row-reverse">
            <div className="h-20 flex items-center">
              <img
                src={
                  language === "ar"
                    ? "https://cdn.builder.io/api/v1/image/assets%2F6cb987f4f6054cf88b5f469a13f2a67e%2F29c97beefe89426cb91fceaee3817c7a?format=webp&width=800"
                    : "https://cdn.builder.io/api/v1/image/assets%2F6cb987f4f6054cf88b5f469a13f2a67e%2F1f3539241b034a2280e7b5e91b51eb3d?format=webp&width=800"
                }
                alt={t("store.title")}
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3 [dir=rtl]:flex-row-reverse">
            {/* Language Switch */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {language === "ar" ? "العربية" : "English"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Button */}
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:bg-primary/5 hover:border-primary transition-colors"
            >
              <ShoppingCart className="h-5 w-5 [dir=rtl]:ml-2 [dir=ltr]:mr-2" />
              {t("store.cart")}
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 [dir=rtl]:-left-2 [dir=rtl]:right-auto h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4 text-center">
              {t("empty.noProductsFound")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
              >
                {/* Product Image */}
                <div
                  className="aspect-square overflow-hidden bg-gray-100"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">{t("products.noImages")}</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div onClick={() => navigate(`/product/${product.id}`)}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors auto-text">
                      {product.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2 auto-text">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between [dir=rtl]:flex-row-reverse">
                    <div>
                      <span className="text-lg font-bold text-primary text-start">
                        BD {product.price.toFixed(2)}
                      </span>
                      {product.totalStock > 0 && (
                        <p className="text-xs text-muted-foreground text-start">
                          {product.totalStock} {t("products.stock")}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.totalStock === 0}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {product.totalStock === 0 && (
                    <Badge
                      variant="secondary"
                      className="w-full mt-2 justify-center text-center"
                    >
                      {t("store.outOfStock")}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add to Cart Dialog */}
      {selectedProduct && (
        <AddToCartDialog
          product={selectedProduct}
          open={isAddToCartOpen}
          onClose={() => {
            setIsAddToCartOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

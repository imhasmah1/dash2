import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Package, Truck } from "lucide-react";
import CheckoutDialog from "./CheckoutDialog";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { t, language, isRTL } = useLanguage();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleQuantityChange = (
    productId: string,
    variantId: string,
    newQuantity: number,
  ) => {
    if (newQuantity <= 0) {
      removeItem(productId, variantId);
    } else {
      updateQuantity(productId, variantId, newQuantity);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[95vh] flex flex-col p-0 rounded-2xl border-0 shadow-2xl bg-white mx-auto">
          <DialogHeader className="px-6 py-6 border-b bg-white">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="auto-text flex-1">{t("store.cart")}</span>
              {items.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary text-white font-semibold px-3 py-1"
                >
                  {items.length}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16 px-6">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-700 auto-text">
                    {t("store.cartEmpty")}
                  </h3>
                  <p className="text-gray-500 auto-text text-sm">
                    {language === "ar"
                      ? t("store.startShoppingAr")
                      : t("store.startShopping")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-8 py-3 h-auto"
                >
                  {t("store.continueShopping")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="group relative bg-white rounded-2xl border border-gray-200 p-3 sm:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      <div
                        className={cn(
                          "flex gap-3 sm:gap-4",
                          isRTL ? "flex-row-reverse" : "",
                        )}
                      >
                        {/* Product Image */}
                        {item.productImage && (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border-2 border-gray-200 shadow-sm">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                          <div
                            className={cn(
                              "flex items-start justify-between gap-2 sm:gap-3",
                              isRTL ? "flex-row-reverse" : "",
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base sm:text-lg text-gray-900 leading-tight auto-text mb-1">
                                {item.productName}
                              </h4>
                              {item.variantName && (
                                <p className="text-xs sm:text-sm text-gray-600 font-medium auto-text">
                                  {item.variantName}
                                </p>
                              )}
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeItem(item.productId, item.variantId)
                              }
                              className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 sm:opacity-0 opacity-100 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>

                          {/* Unit Price */}
                          <div className="bg-primary/10 rounded-lg px-2 sm:px-3 py-2">
                            <div
                              className={cn(
                                "flex items-center justify-between",
                                isRTL ? "flex-row-reverse" : "",
                              )}
                            >
                              <span className="text-xs sm:text-sm font-medium text-gray-700 auto-text">
                                {t("store.unitPrice")}:
                              </span>
                              <span className="text-sm sm:text-lg font-bold text-primary ltr-text">
                                {language === "ar"
                                  ? t("common.currencyAr")
                                  : t("common.currency")}{" "}
                                {item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div
                            className={cn(
                              "flex items-center justify-between",
                              isRTL ? "flex-row-reverse" : "",
                            )}
                          >
                            <span className="text-xs sm:text-sm font-medium text-gray-700 auto-text">
                              {t("store.quantity")}:
                            </span>

                            <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-xl border-2 border-gray-200 p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.variantId,
                                    item.quantity - 1,
                                  )
                                }
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-lg"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>

                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.variantId,
                                    parseInt(e.target.value) || 1,
                                  )
                                }
                                min={1}
                                max={50}
                                className="w-10 sm:w-14 h-7 sm:h-8 text-center text-sm sm:text-base font-semibold border-0 bg-transparent focus:ring-0 ltr-text"
                              />

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.variantId,
                                    item.quantity + 1,
                                  )
                                }
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-lg"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="bg-gray-50 rounded-lg px-2 sm:px-3 py-2 sm:py-3 border-t-2 border-primary/20">
                            <div
                              className={cn(
                                "flex justify-between items-center",
                                isRTL ? "flex-row-reverse" : "",
                              )}
                            >
                              <span className="text-sm sm:text-base font-semibold text-gray-700 auto-text">
                                {language === "ar"
                                  ? t("common.totalAr")
                                  : t("common.total")}
                                :
                              </span>
                              <span className="text-lg sm:text-xl font-bold text-primary ltr-text">
                                {language === "ar"
                                  ? t("common.currencyAr")
                                  : t("common.currency")}{" "}
                                {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <DialogFooter className="flex-col space-y-4 sm:space-y-5 px-4 sm:px-6 py-4 sm:py-6 border-t bg-white">
                {/* Summary */}
                <div className="w-full space-y-3 sm:space-y-4">
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
                    <div
                      className={cn(
                        "flex justify-between items-center mb-2 sm:mb-3",
                        isRTL ? "flex-row-reverse" : "",
                      )}
                    >
                      <span className="auto-text text-gray-700 font-semibold text-base sm:text-lg">
                        {t("store.cartTotal")}:
                      </span>
                      <div className={cn("flex justify-end", isRTL ? "mr-4" : "ml-4")}>
                        <span className="text-xl sm:text-2xl font-bold text-primary ltr-text">
                          {language === "ar"
                            ? t("common.currencyAr")
                            : t("common.currency")}{" "}
                          {totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg py-2 sm:py-3",
                        isRTL ? "flex-row-reverse" : "",
                      )}
                    >
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="auto-text font-medium">
                        <span className="ltr-text">{items.length}</span>{" "}
                        {language === "ar"
                          ? items.length === 1
                            ? t("common.itemAr")
                            : t("common.itemsAr")
                          : items.length === 1
                            ? t("common.item")
                            : t("common.items")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 sm:h-14 touch-manipulation bg-primary hover:bg-primary/90 shadow-lg text-base sm:text-lg font-semibold rounded-xl"
                    disabled={items.length === 0}
                    size="lg"
                  >
                    <Truck
                      className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5",
                        isRTL ? "ml-2 sm:ml-3" : "mr-2 sm:mr-3",
                      )}
                    />
                    <span className="auto-text">{t("store.checkout")}</span>
                  </Button>

                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-10 sm:h-12 touch-manipulation border-gray-300 hover:border-primary hover:bg-primary/5 rounded-xl text-sm sm:text-base"
                    >
                      <span className="auto-text">
                        {t("store.continueShopping")}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex-1 h-10 sm:h-12 touch-manipulation border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm sm:text-base"
                      disabled={items.length === 0}
                    >
                      <span className="auto-text">{t("store.clearCart")}</span>
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}

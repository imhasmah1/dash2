import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { createCustomer, createOrder } from "../services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Check,
  CreditCard,
  Truck,
  Package,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const { t } = useLanguage();
  const { items, getTotalPrice, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const totalPrice = getTotalPrice();

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStep1Valid = () => {
    return (
      customerInfo.name.trim() !== "" &&
      customerInfo.phone.trim() !== "" &&
      customerInfo.address.trim() !== ""
    );
  };

  const isFormValid = () => {
    return isStep1Valid() && items.length > 0;
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      // Create customer
      const customer = await createCustomer({
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
      });

      // Prepare order items
      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create order
      const order = await createOrder({
        customerId: customer.id,
        items: orderItems,
        total: totalPrice,
        status: "processing",
        deliveryType,
        notes: "",
      });

      setOrderNumber(order.id);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(t("message.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomerInfo({ name: "", phone: "", address: "" });
    setDeliveryType("delivery");
    setOrderSuccess(false);
    setOrderNumber("");
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Order Success Content
  if (orderSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-lg sm:rounded-md">
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">
                {t("checkout.orderSuccess")}
              </h2>
              <p className="text-muted-foreground">{t("checkout.thankYou")}</p>
              <p className="text-sm text-muted-foreground border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded text-right [dir=ltr]:text-left [dir=rtl]:border-l-0 [dir=rtl]:border-r-4 [dir=rtl]:pl-0 [dir=rtl]:pr-3">
                {t("checkout.processingMessage")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {t("checkout.orderNumber")}:
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                #{orderNumber}
              </Badge>
            </div>
            <Button onClick={handleClose} className="w-full" size="lg">
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] p-0 rounded-lg sm:rounded-md">
        <div className="flex flex-col h-full text-right [dir=ltr]:text-left">
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 py-4 border-b">
            <DialogTitle className="text-2xl font-bold text-center">
              {t("checkout.title")}
            </DialogTitle>

            {/* Step indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2 sm:space-x-4 [dir=rtl]:space-x-reverse">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                        step >= stepNum
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div
                        className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                          step > stepNum ? "bg-primary" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-6">
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <Card className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 [dir=rtl]:flex-row-reverse">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                        <span className="font-bold">1</span>
                      </div>
                      {t("checkout.customerInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="block text-right [dir=ltr]:text-left"
                        >
                          {t("checkout.customerName")}
                        </Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder={t("checkout.customerName")}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="block text-right [dir=ltr]:text-left"
                        >
                          {t("checkout.customerPhone")}
                        </Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder={t("checkout.customerPhone")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="block text-right [dir=ltr]:text-left"
                      >
                        {t("checkout.customerAddress")}
                      </Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder={t("checkout.customerAddress")}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Delivery Options */}
              {step === 2 && (
                <Card className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 [dir=rtl]:flex-row-reverse">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                        <span className="font-bold">2</span>
                      </div>
                      {t("checkout.deliveryOptions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={deliveryType}
                      onValueChange={(value) =>
                        setDeliveryType(value as "delivery" | "pickup")
                      }
                      className="grid grid-cols-1 gap-4"
                    >
                      <Label htmlFor="delivery" className="cursor-pointer">
                        <div
                          className={`p-6 border-2 rounded-lg transition-all ${deliveryType === "delivery" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <div className="flex items-center space-x-2 [dir=rtl]:space-x-reverse mb-3">
                            <RadioGroupItem value="delivery" id="delivery" />
                            <Truck className="h-6 w-6" />
                          </div>
                          <div className="font-medium text-lg text-right [dir=ltr]:text-left">
                            {t("checkout.delivery")}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 text-right [dir=ltr]:text-left">
                            {t("language.switch") === "تغيير اللغة"
                              ? "يتم التوصيل لباب المنزل"
                              : "Delivered to your door"}
                          </div>
                        </div>
                      </Label>

                      <Label htmlFor="pickup" className="cursor-pointer">
                        <div
                          className={`p-6 border-2 rounded-lg transition-all ${deliveryType === "pickup" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <div className="flex items-center space-x-2 [dir=rtl]:space-x-reverse mb-3">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Package className="h-6 w-6" />
                          </div>
                          <div className="font-medium text-lg text-right [dir=ltr]:text-left">
                            {t("checkout.pickup")}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 text-right [dir=ltr]:text-left">
                            {t("language.switch") === "تغيير اللغة"
                              ? "استلام من المتجر"
                              : "Pick up from store"}
                          </div>
                        </div>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Order Summary */}
              {step === 3 && (
                <Card className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 [dir=rtl]:flex-row-reverse">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                        <span className="font-bold">3</span>
                      </div>
                      {t("checkout.orderSummary")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-right [dir=ltr]:text-left">
                        {t("checkout.customerInfo")}
                      </h4>
                      <p className="text-sm text-right [dir=ltr]:text-left">
                        {customerInfo.name}
                      </p>
                      <p className="text-sm text-right [dir=ltr]:text-left">
                        {customerInfo.phone}
                      </p>
                      <p className="text-sm text-right [dir=ltr]:text-left">
                        {customerInfo.address}
                      </p>
                      <p className="text-sm font-medium mt-2 text-right [dir=ltr]:text-left">
                        {deliveryType === "delivery"
                          ? t("checkout.delivery")
                          : t("checkout.pickup")}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-right [dir=ltr]:text-left">
                        {t("orders.items")}
                      </h4>
                      {items.map((item) => (
                        <div
                          key={`${item.productId}-${item.variantId}`}
                          className="flex justify-between items-center text-sm py-2 border-b [dir=rtl]:flex-row-reverse"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-right [dir=ltr]:text-left">
                              {item.productName}
                            </p>
                            <p className="text-muted-foreground text-right [dir=ltr]:text-left">
                              {item.variantName} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-right [dir=ltr]:text-left">
                            BD {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center text-xl font-bold [dir=rtl]:flex-row-reverse">
                      <span className="text-right [dir=ltr]:text-left">
                        {t("orders.orderTotal")}:
                      </span>
                      <span className="text-primary text-right [dir=ltr]:text-left">
                        BD {totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-3">
              {step > 1 && (
                <Button
                variant="outline"
                onClick={handleBack}
                className="w-full sm:flex-1"
                size="lg"
              >
                  <ArrowLeft className="h-4 w-4 [dir=rtl]:ml-2 [dir=ltr]:mr-2" />
                  {t("language.switch") === "تغيير اللغة" ? "السابق" : "Back"}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleClose}
                className={step === 1 ? "w-full sm:flex-1" : "w-full sm:w-auto"}
                size="lg"
              >
                {t("common.cancel")}
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={step === 1 && !isStep1Valid()}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  {t("language.switch") === "تغيير اللغة" ? "التالي" : "Next"}
                  <ArrowRight className="h-4 w-4 [dir=rtl]:mr-2 [dir=ltr]:ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 [dir=rtl]:ml-2 [dir=ltr]:mr-2" />
                  {isSubmitting
                    ? t("common.loading")
                    : t("checkout.placeOrder")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

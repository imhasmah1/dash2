import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { createCustomer, createOrder } from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Check, CreditCard, Truck, Package } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const { t } = useLanguage();
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const totalPrice = getTotalPrice();

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return (
      customerInfo.name.trim() !== '' &&
      customerInfo.phone.trim() !== '' &&
      customerInfo.address.trim() !== '' &&
      items.length > 0
    );
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
      const orderItems = items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create order
      const order = await createOrder({
        customerId: customer.id,
        items: orderItems,
        status: 'processing',
        deliveryType,
        notes: '',
      });

      setOrderNumber(order.id);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Failed to place order:', error);
      alert(t('message.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomerInfo({ name: '', phone: '', address: '' });
    setDeliveryType('delivery');
    setOrderSuccess(false);
    setOrderNumber('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Order Success Content
  if (orderSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">{t('checkout.orderSuccess')}</h2>
              <p className="text-muted-foreground">{t('checkout.thankYou')}</p>
              <p className="text-sm text-muted-foreground border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded">
                {t('checkout.processingMessage')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('checkout.orderNumber')}:</p>
              <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                #{orderNumber}
              </Badge>
            </div>
            <Button onClick={handleClose} className="w-full" size="lg">
              {t('common.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-2xl font-bold text-center">
              {t('checkout.title')}
            </DialogTitle>
            <p className="text-center text-muted-foreground text-sm">
              {t('checkout.noCreditCard')}
            </p>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Customer Information Card */}
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    {t('checkout.customerInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('checkout.customerName')}</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={t('checkout.customerName')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('checkout.customerPhone')}</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('checkout.customerPhone')}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('checkout.customerAddress')}</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={t('checkout.customerAddress')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Options Card */}
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    {t('checkout.deliveryOptions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={deliveryType} 
                    onValueChange={(value) => setDeliveryType(value as 'delivery' | 'pickup')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label htmlFor="delivery" className="cursor-pointer">
                      <div className={`p-4 border-2 rounded-lg transition-all ${deliveryType === 'delivery' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex items-center space-x-2 [dir=rtl]:space-x-reverse mb-2">
                          <RadioGroupItem value="delivery" id="delivery" />
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="font-medium">{t('checkout.delivery')}</div>
                      </div>
                    </Label>
                    
                    <Label htmlFor="pickup" className="cursor-pointer">
                      <div className={`p-4 border-2 rounded-lg transition-all ${deliveryType === 'pickup' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex items-center space-x-2 [dir=rtl]:space-x-reverse mb-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="font-medium">{t('checkout.pickup')}</div>
                      </div>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Summary Card */}
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    {t('checkout.orderSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center text-sm py-2 border-b">
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-muted-foreground">{item.variantName} × {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>{t('orders.orderTotal')}:</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t bg-muted/20">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={!isFormValid() || isSubmitting}
                className="flex-1"
                size="lg"
              >
                <CreditCard className="h-4 w-4 [dir=rtl]:ml-2 [dir=ltr]:mr-2" />
                {isSubmitting ? t('common.loading') : t('checkout.placeOrder')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

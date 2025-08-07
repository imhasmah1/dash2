import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { createCustomer, createOrder } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';

export default function Checkout() {
  const { t } = useLanguage();
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
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
        total: totalPrice,
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

  // Redirect if cart is empty and not showing success
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">{t('store.cartEmpty')}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              {t('store.continueShopping')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">{t('checkout.orderSuccess')}</h2>
            <p className="text-muted-foreground">{t('checkout.thankYou')}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('checkout.orderNumber')}:</p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                #{orderNumber}
              </Badge>
            </div>
            <Button onClick={() => navigate('/')} className="w-full">
              {t('checkout.backToStore')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/store')}
            >
              <ArrowLeft className="h-4 w-4 [dir=rtl]:ml-2 [dir=ltr]:mr-2" />
              {t('store.continueShopping')}
            </Button>
            <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.customerInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.deliveryOptions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={deliveryType} 
                  onValueChange={(value) => setDeliveryType(value as 'delivery' | 'pickup')}
                >
                  <div className="flex items-center space-x-2 [dir=rtl]:space-x-reverse">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">{t('checkout.delivery')}</Label>
                  </div>
                  <div className="flex items-center space-x-2 [dir=rtl]:space-x-reverse">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">{t('checkout.pickup')}</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* No Credit Card Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-sm text-green-800 text-center">
                  {t('checkout.noCreditCard')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-muted-foreground">{item.variantName}</p>
                        <p className="text-muted-foreground">
                          {t('store.quantity')}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t('orders.orderTotal')}:</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? t('common.loading') : t('checkout.placeOrder')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

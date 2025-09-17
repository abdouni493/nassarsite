import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { algerianWilayas } from '@/data/wilayas';
import { ShoppingCart, User, Phone, Mail, MapPin, Package, CreditCard } from 'lucide-react';

interface OrderFormProps {
  onOrderSubmit: (orderData: any) => void;
}

interface OrderFormData {
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  address: string;
  notes: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderSubmit }) => {
  const { t, language } = useLanguage();
  const { items, totalPrice, totalItems } = useCart();
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phone: '',
    email: '',
    wilaya: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderData = {
      ...formData,
      items,
      totalPrice,
      totalItems,
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString()
    };

    onOrderSubmit(orderData);
    setIsSubmitting(false);
  };

  const isFormValid = formData.fullName && formData.phone && formData.wilaya && formData.address;

  return (
    <section className="py-12 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <h1 className="text-3xl font-bold mb-2">{t('orderForm')}</h1>
            <p className="text-muted-foreground">
              املأ البيانات التالية لإتمام طلبك
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="card-elevated p-6 slide-in-left">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                {t('personalInfo')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    {t('fullName')} *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t('phone')} *
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0555 123 456"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('email')}
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Wilaya */}
                <div>
                  <Label htmlFor="wilaya" className="text-sm font-medium">
                    {t('wilaya')} *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('wilaya', value)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="اختر الولاية" />
                    </SelectTrigger>
                    <SelectContent>
                      {algerianWilayas.map((wilaya) => (
                        <SelectItem key={wilaya.code} value={wilaya.code}>
                          {wilaya.code} - {language === 'ar' ? wilaya.name : wilaya.nameFr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    {t('address')} *
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="أدخل عنوانك التفصيلي"
                      required
                      className="pl-10 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    ملاحظات إضافية
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي ملاحظات خاصة بالطلب..."
                    className="mt-1"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري المعالجة...
                    </div>
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-2" />
                      {t('submitOrder')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6 slide-in-right">
              {/* Cart Items Summary */}
              <div className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                  {t('orderSummary')}
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={language === 'ar' ? item.nameAr : item.nameFr}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {language === 'ar' ? item.nameAr : item.nameFr}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {(item.price * item.quantity).toLocaleString()} دج
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">المجموع الكلي:</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice.toLocaleString()} دج
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  معلومات الدفع
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>طريقة الدفع:</strong> الدفع عند الاستلام
                  </p>
                  <p className="text-sm text-muted-foreground">
                    سيتم تحصيل قيمة الطلب عند التسليم. يرجى التأكد من وجود المبلغ المطلوب.
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  معلومات التوصيل
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>مدة التوصيل:</strong> 2-5 أيام عمل</p>
                  <p><strong>رسوم التوصيل:</strong> مجاني للطلبات أكثر من 5000 دج</p>
                  <p><strong>تغطية التوصيل:</strong> جميع أنحاء الجزائر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
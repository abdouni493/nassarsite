import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle, Package, Phone, Home, Sparkles } from 'lucide-react';

interface ThankYouPageProps {
  orderData: any;
  onNavigate: (section: string) => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ orderData, onNavigate }) => {
  const { t } = useLanguage();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
  }, [clearCart]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-12 min-h-screen bg-gradient-to-br from-success/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8 fade-in">
            <div className="relative">
              <div className="w-32 h-32 bg-success/10 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-20 h-20 text-success animate-bounce" />
              </div>
              {/* Sparkle effects */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <Sparkles className="w-6 h-6 text-accent animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="absolute top-8 right-1/4">
                <Sparkles className="w-4 h-4 text-primary animate-ping" style={{ animationDelay: '1s' }} />
              </div>
              <div className="absolute top-8 left-1/4">
                <Sparkles className="w-5 h-5 text-accent animate-ping" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-8 slide-in-right">
            <h1 className="text-4xl md:text-5xl font-bold text-success mb-4">
              {t('thankYou')}!
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
              {t('orderSuccess')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('contactSoon')}
            </p>
          </div>

          {/* Order Details Card */}
          <div className="card-elevated p-8 mb-8 text-right slide-in-left">
            <h3 className="text-xl font-bold mb-6 flex items-center justify-center">
              <Package className="h-6 w-6 mr-3 text-primary" />
              تفاصيل الطلب
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">رقم الطلب</p>
                  <p className="text-lg font-bold text-primary">{orderData.orderNumber}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
                  <p className="font-medium">
                    {new Date(orderData.orderDate).toLocaleDateString('ar-DZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">المجموع الكلي</p>
                  <p className="text-xl font-bold text-success">{orderData.totalPrice.toLocaleString()} دج</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-medium">{orderData.fullName}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                  <p className="font-medium">{orderData.phone}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">الولاية</p>
                  <p className="font-medium">{orderData.wilaya}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-4">المنتجات المطلوبة ({orderData.totalItems} منتج)</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orderData.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <div>
                      <span className="font-medium">{item.nameAr}</span>
                      <span className="text-sm text-muted-foreground"> x{item.quantity}</span>
                    </div>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} دج</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="card-elevated p-6 mb-8 fade-in">
            <h3 className="text-lg font-bold mb-4">الخطوات التالية</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p>سنتواصل معك خلال 24 ساعة لتأكيد الطلب</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p>سيتم تحضير وتغليف طلبك بعناية</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p>سيصلك الطلب خلال 2-5 أيام عمل</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <p>الدفع عند الاستلام</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card-elevated p-6 mb-8 slide-in-right">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              معلومات الاتصال
            </h3>
            <div className="space-y-2 text-sm">
              <p>للاستفسار عن طلبك أو أي مساعدة:</p>
              <p className="font-medium">📞 هاتف: 0555 123 456</p>
              <p className="font-medium">📱 واتساب: 0666 789 012</p>
              <p className="font-medium">✉️ إيميل: info@nasser-equipments.dz</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-in-left">
            <Button
              variant="hero"
              size="lg"
              onClick={() => onNavigate('home')}
              className="px-8"
            >
              <Home className="h-5 w-5 mr-2" />
              العودة للرئيسية
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrint}
              className="px-8"
            >
              <Package className="h-5 w-5 mr-2" />
              طباعة تفاصيل الطلب
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={() => onNavigate('categories')}
              className="px-8"
            >
              متابعة التسوق
            </Button>
          </div>

          {/* Celebration Elements */}
          <div className="absolute top-10 left-10 opacity-20 float-animation">
            <div className="w-8 h-8 bg-success/30 rounded-full"></div>
          </div>
          <div className="absolute bottom-20 right-20 opacity-20 float-animation" style={{ animationDelay: '1s' }}>
            <div className="w-6 h-6 bg-accent/30 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 right-10 opacity-20 float-animation" style={{ animationDelay: '2s' }}>
            <div className="w-10 h-10 bg-primary/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouPage;
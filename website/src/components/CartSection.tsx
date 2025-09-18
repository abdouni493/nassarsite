import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartSectionProps {
  onNavigate: (section: string) => void;
}

const API_BASE = "http://localhost:5000";

const CartSection: React.FC<CartSectionProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-12 min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-3xl font-bold mb-4">{t('emptyCart')}</h2>
              <p className="text-muted-foreground mb-8">
                لا توجد منتجات في سلة التسوق حالياً
              </p>
              <Button
                variant="hero"
                size="lg"
                onClick={() => onNavigate('categories')}
              >
                تصفح المنتجات
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('cartTitle')}</h1>
            <p className="text-muted-foreground">
              {totalItems} منتج في السلة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = item.price ?? item.selling_price ?? 0;
                const total = price * (item.quantity ?? 1);
                const imageUrl = item.image
                  ? `${API_BASE}${item.image}`
                  : "/placeholder.svg";

                return (
                  <div key={item.id} className="card-elevated p-4 fade-in">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={language === 'ar' ? item.nameAr : item.nameFr}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {language === 'ar' ? item.nameAr : item.nameFr}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {language === 'ar' ? item.descriptionAr : item.descriptionFr}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold text-primary">
                            {price.toLocaleString()} دج
                          </span>
                          {item.isSpecialOffer && item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice.toLocaleString()} دج
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {total.toLocaleString()} دج
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>عدد المنتجات:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>{t('total')}:</span>
                    <span className="text-primary">
  {items.reduce((sum, item) => {
    const price = Number(item.price ?? item.selling_price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return sum + price * qty;
  }, 0).toLocaleString()} دج
</span>

                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => onNavigate('order')}
                    className="w-full"
                  >
                    {t('checkout')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('categories')}
                    className="w-full"
                  >
                    متابعة التسوق
                  </Button>
                </div>

                {/* Special Offers Suggestion */}
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">عروض خاصة!</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    اكتشف عروضنا الخاصة واحصل على خصومات إضافية
                  </p>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => onNavigate('offers')}
                    className="w-full"
                  >
                    عرض العروض الخاصة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;

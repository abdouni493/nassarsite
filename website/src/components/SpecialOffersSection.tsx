import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { getSpecialOffers } from '@/data/products';
import { ShoppingCart, Clock, Star, Zap } from 'lucide-react';

interface SpecialOffersSectionProps {
  onNavigate: (section: string) => void;
}

const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const specialOffers = getSpecialOffers();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <section className="py-12 min-h-screen bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full inline-flex items-center space-x-2 pulse-glow">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">{t('limitedTime')}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('specialOffers')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف أفضل العروض والخصومات الحصرية على منتجاتنا المختارة
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
        </div>

        {/* Countdown Timer */}
        <div className="text-center mb-12 slide-in-right">
          <div className="bg-card border border-accent/20 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-accent mr-2" />
              <span className="text-lg font-semibold">ينتهي العرض خلال:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { value: '02', label: 'أيام' },
                { value: '14', label: 'ساعات' },
                { value: '32', label: 'دقائق' },
                { value: '18', label: 'ثواني' }
              ].map((item, index) => (
                <div key={index} className="bg-accent text-accent-foreground rounded-lg p-3">
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {specialOffers.map((product, index) => (
            <div
              key={product.id}
              className="card-elevated group overflow-hidden pulse-glow"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Product Image */}
              <div className="relative h-56 bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={language === 'ar' ? product.nameAr : product.nameFr}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Discount Badge */}
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-lg px-3 py-2 pulse-glow">
                  -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                </Badge>

                {/* Limited Time Badge */}
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  عرض محدود
                </Badge>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {language === 'ar' ? product.nameAr : product.nameFr}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ar' ? product.descriptionAr : product.descriptionFr}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground mr-2">(4.8)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-accent">
                        {product.price.toLocaleString()} دج
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        {product.originalPrice?.toLocaleString()} دج
                      </span>
                    </div>
                    <div className="text-sm text-success font-semibold">
                      وفر {(product.originalPrice! - product.price).toLocaleString()} دج
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="offer"
                  size="lg"
                  onClick={() => handleAddToCart(product)}
                  className="w-full text-lg font-semibold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  اشتر الآن
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center fade-in">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              لا تفوت هذه الفرصة الذهبية!
            </h3>
            <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
              عروض حصرية ومحدودة على أفضل منتجاتنا. اطلب الآن واحصل على شحن مجاني لجميع أنحاء الجزائر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="lg"
                onClick={() => onNavigate('categories')}
                className="bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm px-8"
              >
                تصفح جميع المنتجات
              </Button>
              <Button
                size="lg"
                onClick={() => onNavigate('cart')}
                className="px-8 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg border-2 border-yellow-400"
              >
                لا تفوت هذه الفرصة الذهبية!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
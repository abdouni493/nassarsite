import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart, Product } from '@/contexts/CartContext';
import { products, getProductsByCategory } from '@/data/products';
import { ShoppingCart, Star, ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductsSectionProps {
  category?: string;
  onBack: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ category, onBack }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  // Get products based on category or show all
  const categoryProducts = category ? getProductsByCategory(category) : products;
  
  // Filter products based on search term
  const filteredProducts = categoryProducts.filter(product => {
    const name = language === 'ar' ? product.nameAr : product.nameFr;
    const description = language === 'ar' ? product.descriptionAr : product.descriptionFr;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // You could add a toast notification here
  };

  const getCategoryName = (categoryId: string) => {
    const categoryNames = {
      automotive: t('automotive'),
      industrial: t('industrial'),
      tools: t('tools'),
      electronics: t('electronics')
    };
    return categoryNames[categoryId as keyof typeof categoryNames] || categoryId;
  };

  return (
    <section className="py-12 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('categories')}</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {category ? getCategoryName(category) : 'جميع المنتجات'}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} منتج متاح
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'ar' ? 'البحث في المنتجات...' : 'Rechercher des produits...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-elevated group overflow-hidden fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={language === 'ar' ? product.nameAr : product.nameFr}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Special Offer Badge */}
                {product.isSpecialOffer && (
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground pulse-glow">
                    {t('discount')} {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </Badge>
                )}

                {/* Stock Status */}
                <Badge 
                  className={`absolute bottom-2 left-2 ${
                    product.inStock 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-destructive text-destructive-foreground'
                  }`}
                >
                  {product.inStock ? t('inStock') : t('outOfStock')}
                </Badge>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {language === 'ar' ? product.nameAr : product.nameFr}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {language === 'ar' ? product.descriptionAr : product.descriptionFr}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price.toLocaleString()} دج
                    </span>
                    {product.isSpecialOffer && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice?.toLocaleString()} دج
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant={product.isSpecialOffer ? "offer" : "default"}
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('addToCart')}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">لم يتم العثور على منتجات</p>
              <p className="text-sm">جرب تغيير كلمات البحث أو اختر فئة أخرى</p>
            </div>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              مسح البحث
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
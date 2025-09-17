import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();

  const navigationItems = [
    { key: 'home', label: t('home') },
    { key: 'categories', label: t('categories') },
    { key: 'offers', label: t('offers') },
    { key: 'contact', label: t('contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">
              ناصر للمعدات والعتاد
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentSection === item.key ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'FR' : 'AR'}
            </Button>

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('cart')}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 min-w-[20px] h-[20px] flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Order Button */}
            <Button
              variant="accent"
              size="sm"
              onClick={() => onNavigate('order')}
              className="hidden sm:flex"
            >
              {t('order')}
            </Button>

            {/* Admin Button */}
           
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 text-sm font-medium w-full text-left transition-colors hover:text-primary ${
                    currentSection === item.key ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'Français' : 'العربية'}
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    onNavigate('order');
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2"
                >
                  {t('order')}
                </Button>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
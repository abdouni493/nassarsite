import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import ProductsSection from '@/components/ProductsSection';
import CartSection from '@/components/CartSection';
import SpecialOffersSection from '@/components/SpecialOffersSection';
import OrderForm from '@/components/OrderForm';
import ThankYouPage from '@/components/ThankYouPage';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [orderData, setOrderData] = useState<any>(null);

  const handleNavigate = (section: string, category?: string) => {
    setCurrentSection(section);
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(undefined);
    }
  };

  const handleOrderSubmit = (data: any) => {
    setOrderData(data);
    setCurrentSection('thank-you');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <CategoriesSection onNavigate={handleNavigate} />
            <SpecialOffersSection onNavigate={handleNavigate} />
          </>
        );
      case 'categories':
        return <CategoriesSection onNavigate={handleNavigate} />;
      case 'products':
        return (
          <ProductsSection
            category={selectedCategory}
            onBack={() => handleNavigate('categories')}
          />
        );
      case 'cart':
        return <CartSection onNavigate={handleNavigate} />;
      case 'offers':
        return <SpecialOffersSection onNavigate={handleNavigate} />;
      case 'order':
        return <OrderForm onOrderSubmit={handleOrderSubmit} />;
      case 'thank-you':
        return <ThankYouPage orderData={orderData} />; // ✅ removed onNavigate
      case 'contact':
        return <ContactSection onNavigate={handleNavigate} />;
      default:
        return (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <CategoriesSection onNavigate={handleNavigate} />
            <SpecialOffersSection onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />
      {renderCurrentSection()}
    </div>
  );
};

export default Index;

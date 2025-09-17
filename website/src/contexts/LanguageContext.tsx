import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    categories: 'الفئات',
    offers: 'العروض الخاصة',
    contact: 'اتصل بنا',
    cart: 'سلة التسوق',
    order: 'طلب',
    
    // Hero Section
    welcome: 'مرحباً بكم في ناصر للمعدات و العتاد',
    heroTitle: 'متجرك المتخصص في قطع الغيار والمعدات',
    heroSubtitle: 'نوفر أجود أنواع قطع الغيار والمعدات الصناعية والسيارات بأفضل الأسعار',
    shopNow: 'تسوق الآن',
    viewCategories: 'عرض الفئات',
    
    // Categories
    categoriesTitle: 'فئات المنتجات',
    automotive: 'قطع غيار السيارات',
    industrial: 'المعدات الصناعية',
    tools: 'الأدوات',
    electronics: 'الإلكترونيات',
    
    // Products
    addToCart: 'أضف للسلة',
    price: 'السعر',
    quantity: 'الكمية',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    
    // Cart
    cartTitle: 'سلة التسوق',
    emptyCart: 'السلة فارغة',
    total: 'المجموع',
    checkout: 'إتمام الطلب',
    
    // Order Form
    orderForm: 'نموذج الطلب',
    personalInfo: 'المعلومات الشخصية',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني (اختياري)',
    wilaya: 'الولاية',
    address: 'العنوان',
    orderSummary: 'ملخص الطلب',
    submitOrder: 'تأكيد الطلب',
    
    // Thank you page
    thankYou: 'شكراً لك!',
    orderSuccess: 'تم تسجيل طلبك بنجاح',
    orderNumber: 'رقم الطلب',
    contactSoon: 'سنتواصل معك قريباً',
    
    // Special Offers
    specialOffers: 'العروض الخاصة',
    limitedTime: 'لفترة محدودة',
    discount: 'خصم',
    
    // About
    aboutTitle: 'عن ناصر للمعدات و العتاد',
    aboutText: 'نحن متجر متخصص في توفير قطع الغيار والمعدات عالية الجودة. نخدم عملاءنا منذ سنوات عديدة ونفخر بتقديم أفضل المنتجات بأسعار تنافسية.'
  },
  fr: {
    // Navigation
    home: 'Accueil',
    categories: 'Catégories',
    offers: 'Offres Spéciales',
    contact: 'Contact',
    cart: 'Panier',
    order: 'Commander',
    
    // Hero Section
    welcome: 'Bienvenue chez Nasser Équipements et Matériel',
    heroTitle: 'Votre magasin spécialisé en pièces détachées et équipements',
    heroSubtitle: 'Nous fournissons les meilleures pièces détachées et équipements industriels et automobiles aux meilleurs prix',
    shopNow: 'Acheter Maintenant',
    viewCategories: 'Voir les Catégories',
    
    // Categories
    categoriesTitle: 'Catégories de Produits',
    automotive: 'Pièces Automobiles',
    industrial: 'Équipements Industriels',
    tools: 'Outils',
    electronics: 'Électronique',
    
    // Products
    addToCart: 'Ajouter au Panier',
    price: 'Prix',
    quantity: 'Quantité',
    inStock: 'En Stock',
    outOfStock: 'Rupture de Stock',
    
    // Cart
    cartTitle: 'Panier d\'Achat',
    emptyCart: 'Panier Vide',
    total: 'Total',
    checkout: 'Finaliser la Commande',
    
    // Order Form
    orderForm: 'Formulaire de Commande',
    personalInfo: 'Informations Personnelles',
    fullName: 'Nom Complet',
    phone: 'Numéro de Téléphone',
    email: 'Email (optionnel)',
    wilaya: 'Wilaya',
    address: 'Adresse',
    orderSummary: 'Résumé de la Commande',
    submitOrder: 'Confirmer la Commande',
    
    // Thank you page
    thankYou: 'Merci!',
    orderSuccess: 'Votre commande a été enregistrée avec succès',
    orderNumber: 'Numéro de Commande',
    contactSoon: 'Nous vous contacterons bientôt',
    
    // Special Offers
    specialOffers: 'Offres Spéciales',
    limitedTime: 'Temps Limité',
    discount: 'Remise',
    
    // About
    aboutTitle: 'À Propos de Nasser Équipements et Matériel',
    aboutText: 'Nous sommes un magasin spécialisé dans la fourniture de pièces détachées et d\'équipements de haute qualité. Nous servons nos clients depuis de nombreuses années et sommes fiers d\'offrir les meilleurs produits à des prix compétitifs.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  // Set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
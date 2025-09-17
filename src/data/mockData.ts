import { Category, Product, SpecialOffer, OfferProduct, Contact, Settings, Order } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    nameFr: 'Électronique',
    nameAr: 'إلكترونيات',
    image: '/placeholder.svg',
    productsCount: 15
  },
  {
    id: 'cat2',
    nameFr: 'Vêtements',
    nameAr: 'ملابس',
    image: '/placeholder.svg',
    productsCount: 23
  },
  {
    id: 'cat3',
    nameFr: 'Maison & Jardin',
    nameAr: 'المنزل والحديقة',
    image: '/placeholder.svg',
    productsCount: 8
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    nameFr: 'Smartphone Samsung Galaxy',
    nameAr: 'هاتف سامسونغ غالاكسي',
    price: 45000,
    descriptionFr: 'Smartphone haut de gamme avec écran AMOLED',
    descriptionAr: 'هاتف ذكي فاخر مع شاشة AMOLED',
    image: '/placeholder.svg',
    quality: 4,
    barcode: '1234567890123',
    categoryId: 'cat1'
  },
  {
    id: 'prod2',
    nameFr: 'T-shirt en coton',
    nameAr: 'قميص قطني',
    price: 2500,
    descriptionFr: 'T-shirt confortable en coton 100%',
    descriptionAr: 'قميص مريح من القطن 100%',
    image: '/placeholder.svg',
    quality: 5,
    barcode: '1234567890124',
    categoryId: 'cat2'
  }
];

export const mockSpecialOffers: SpecialOffer[] = [
  {
    id: 'offer1',
    name: 'Promotion Électronique',
    description: 'Réduction sur tous les appareils électroniques',
    endTime: '2024-12-31T23:59:59',
    isActive: true,
    productsCount: 5
  },
  {
    id: 'offer2',
    name: 'Soldes Vêtements',
    description: 'Jusqu\'à 50% de réduction sur les vêtements',
    endTime: '2024-11-30T23:59:59',
    isActive: false,
    productsCount: 12
  }
];

export const mockOfferProducts: OfferProduct[] = [
  {
    id: 'prod1',
    nameFr: 'Smartphone Samsung Galaxy',
    nameAr: 'هاتف سامسونغ غالاكسي',
    price: 45000,
    newPrice: 35000,
    savings: 10000,
    percentage: 22,
    descriptionFr: 'Smartphone haut de gamme avec écran AMOLED',
    descriptionAr: 'هاتف ذكي فاخر مع شاشة AMOLED',
    image: '/placeholder.svg',
    quality: 4,
    barcode: '1234567890123',
    categoryId: 'cat1',
    offerId: 'offer1'
  }
];

export const mockContact: Contact = {
  phone: '+213 555 123 456',
  whatsapp: '+213 555 123 456',
  email: 'contact@monsite.com',
  facebook: 'https://facebook.com/monsite',
  instagram: 'https://instagram.com/monsite',
  tiktok: 'https://tiktok.com/@monsite',
  viber: '+213 555 123 456',
  mapUrl: 'https://maps.google.com'
};

export const mockSettings: Settings = {
  siteNameFr: 'Mon Site E-commerce',
  siteNameAr: 'موقع التجارة الإلكترونية',
  descriptionFr: 'Votre destination pour les meilleurs produits en ligne',
  descriptionAr: 'وجهتك للحصول على أفضل المنتجات عبر الإنترنت'
};

export const mockOrders: Order[] = [
  {
    id: 'order1',
    clientName: 'Ahmed Benali',
    phone: '+213 555 987 654',
    status: 'pending',
    items: [
      {
        productId: 'prod1',
        productName: 'Smartphone Samsung Galaxy',
        quantity: 1,
        price: 45000,
        total: 45000
      },
      {
        productId: 'prod2',
        productName: 'T-shirt en coton',
        quantity: 2,
        price: 2500,
        total: 5000
      }
    ],
    total: 50000,
    date: '2024-01-15T10:30:00',
    discount: 0
  },
  {
    id: 'order2',
    clientName: 'Fatima Larbi',
    phone: '+213 555 456 789',
    status: 'confirmed',
    items: [
      {
        productId: 'prod2',
        productName: 'T-shirt en coton',
        quantity: 3,
        price: 2500,
        total: 7500
      }
    ],
    total: 7500,
    date: '2024-01-14T15:45:00',
    discount: 500
  },
  {
    id: 'order3',
    clientName: 'Omar Kadi',
    phone: '+213 555 321 654',
    status: 'completed',
    items: [
      {
        productId: 'prod1',
        productName: 'Smartphone Samsung Galaxy',
        quantity: 1,
        price: 45000,
        total: 45000
      }
    ],
    total: 45000,
    date: '2024-01-13T09:15:00',
    discount: 2000
  }
];
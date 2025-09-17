import { useState, useEffect } from 'react';
import {
  Grid,
  Percent,
  Phone,
  Settings as SettingsIcon,
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Clock,
  Save,
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
  Music,
  MapPin,
  Globe,
  FileText,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

// --- Type Definitions ---
interface Category { id: number; nameFr: string; nameAr: string; image?: string; productsCount?: number; }


interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  endTime: string;
  isActive: boolean;
  productsCount: number;
}
interface Product {
  id: number;
  nameFr: string;
  nameAr?: string;
  price: number;
  descriptionFr?: string;
  descriptionAr?: string;
  image?: string;
  quality?: number;
  barcode?: string;
  categoryId?: number;
}

interface OfferProduct {
  id: string;
  offerId?: number;
  productId?: number;
  nameFr?: string;
  nameAr?: string;
  price?: number;
  newPrice?: number;
  savings?: number;
  percentage?: number;
  descriptionFr: string;
  descriptionAr: string;
  image: string;
  quality: number;
  barcode: string;
  categoryId: string;
}

interface Contact {
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  viber: string;
  mapUrl: string;
}

interface Settings {
  siteNameFr: string;
  siteNameAr: string;
  descriptionFr: string;
  descriptionAr: string;
}

type ActiveSection = 'categories' | 'offers' | 'contacts' | 'settings';
type ViewMode = 'overview' | 'products' | 'offerProducts';

interface ViewState {
  mode: ViewMode;
  selectedCategory?: Category;
  selectedOffer?: SpecialOffer;
}

// Dummy StarRating component
const StarRating = ({ rating, onRatingChange, readonly, label }: { rating: number; onRatingChange: (rating: number) => void; readonly?: boolean; label?: string; }) => {
  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-sm font-semibold">{label}:</span>}
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => !readonly && onRatingChange(i + 1)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};
const API = '/api';

const WebsiteManage = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('categories');
  const [viewState, setViewState] = useState<ViewState>({ mode: 'overview' });
  const { language, setLanguage, t } = useLanguage();

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFormData, setCategoryFormData] = useState({
    nameFr: '',
    nameAr: '',
    image: '',
    imageFile: null
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);
  const [showEditProductDialog, setShowEditProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchSelectedProduct, setSearchSelectedProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    nameFr: '',
    nameAr: '',
    price: 0,
    descriptionFr: '',
    descriptionAr: '',
    image: '',
    quality: 5,
    barcode: '',
    imageFile: null
  });

  // Special Offers state
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [offerFormData, setOfferFormData] = useState({
    name: '',
    description: '',
    endTime: ''
  });
  const [selectedOffer, setSelectedOffer] = useState<SpecialOffer | null>(null);
  const [showCreateOfferDialog, setShowCreateOfferDialog] = useState(false);
  const [showEditOfferDialog, setShowEditOfferDialog] = useState(false);

  // Offer Products state
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([]);
  const [offerProductSearchTerm, setOfferProductSearchTerm] = useState('');
  const [showCreateOfferProductDialog, setShowCreateOfferProductDialog] = useState(false);
  const [showEditOfferProductDialog, setShowEditOfferProductDialog] = useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<OfferProduct | null>(null);
  const [showOfferProductForm, setShowOfferProductForm] = useState(false);
  const [searchSelectedOfferProduct, setSearchSelectedOfferProduct] = useState<Product | null>(null);
  const [offerProductFormData, setOfferProductFormData] = useState({
    nameFr: '',
    nameAr: '',
    price: 0,
    newPrice: 0,
    savings: 0,
    percentage: 0,
    descriptionFr: '',
    descriptionAr: '',
    image: '',
    quality: 5,
    barcode: '',
    imageFile: null
  });

  // Contacts state
  const [contact, setContact] = useState<Contact>({
    phone: '',
    whatsapp: '',
    email: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    viber: '',
    mapUrl: '',
  });

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    siteNameFr: '',
    siteNameAr: '',
    descriptionFr: '',
    descriptionAr: ''
  });

  const menuItems = [
    {
      id: 'categories' as const,
      label: t('categories'),
      icon: Grid,
      description: t('manageCategories')
    },
    {
      id: 'offers' as const,
      label: t('specialOffers'),
      icon: Percent,
      description: 'Créer et gérer les offres spéciales'
    },
    {
      id: 'contacts' as const,
      label: t('contacts'),
      icon: Phone,
      description: 'Configurer les informations de contact'
    },
    {
      id: 'settings' as const,
      label: t('settings'),
      icon: SettingsIcon,
      description: 'Paramètres généraux du site'
    }
  ];

  useEffect(() => {
    loadCategories();
    loadOffers();
    loadContact();
    loadSettings();
    loadProducts();
  }, []);

  // API Handlers
  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch(`${API}/api/upload`, { method: 'POST', body: fd });
    return await r.json(); // { url: '/uploads/abc' }
  }

  async function loadCategories() {
    try {
      const r = await fetch(`${API}/api/categories`);
      const data = await r.json();
      setCategories(data);
    } catch (err) {
      console.error('Load categories error', err);
      toast({ title: 'Error', description: 'Failed to load categories' });
    }
  }

  async function loadOffers() {
    try {
      const r = await fetch(`${API}/api/offers`);
      const data = await r.json();
      setOffers(data);
    } catch (err) {
      console.error('Load offers error', err);
      toast({ title: 'Error', description: 'Failed to load offers' });
    }
  }

  async function loadProducts(search: string | number = '') {
  const q =
    search === '' ? '' : `?search=${encodeURIComponent(String(search))}`;
  const r = await fetch(`${API}/api/products${q}`);
  const data = await r.json();
  setProducts(data);
}

  
  async function loadOfferProducts(offerId) {
    try {
      const r = await fetch(`${API}/api/offers/${offerId}/products`);
      const data = await r.json();
      setOfferProducts(data);
    } catch (err) {
      console.error('Load offer products error', err);
      toast({ title: 'Error', description: 'Failed to load offer products' });
    }
  }

  async function loadContact() {
    try {
      const r = await fetch(`${API}/api/contact`);
      const data = await r.json();
      setContact(data);
    } catch (err) {
      console.error('Load contact error', err);
      toast({ title: 'Error', description: 'Failed to load contact info' });
    }
  }

  async function loadSettings() {
    try {
      const r = await fetch(`${API}/api/settings`);
      const data = await r.json();
      setSettings(data);
    } catch (err) {
      console.error('Load settings error', err);
      toast({ title: 'Error', description: 'Failed to load settings' });
    }
  }

  // Category handlers
  const handleCreateCategory = async () => {
    try {
      let imageUrl = categoryFormData.image;
      if (categoryFormData.imageFile) {
        const res = await uploadFile(categoryFormData.imageFile);
        imageUrl = res.url;
      }
      
      const r = await fetch(`${API}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameFr: categoryFormData.nameFr, nameAr: categoryFormData.nameAr, image: imageUrl })
      });
      if (!r.ok) throw new Error('Failed');
      
      await loadCategories();
      toast({ title: t('categoryCreated') });
      setCategoryFormData({ nameFr: '', nameAr: '', image: '', imageFile: null });
      setShowCreateCategoryDialog(false);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToCreateCategory') });
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    try {
      let imageUrl = categoryFormData.image;
      if (categoryFormData.imageFile) {
        const res = await uploadFile(categoryFormData.imageFile);
        imageUrl = res.url;
      }

      await fetch(`${API}/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameFr: categoryFormData.nameFr, nameAr: categoryFormData.nameAr, image: imageUrl })
      });
      await loadCategories();
      toast({ title: t('categorySaved') });
      setCategoryFormData({ nameFr: '', nameAr: '', image: '', imageFile: null });
      setShowEditCategoryDialog(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToSaveCategory') });
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
  try {
    await fetch(`${API}/api/categories/${categoryId}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast({ title: t('deleted') });
  } catch (err) {
    console.error(err);
    toast({ title: 'Error', description: t('failedToDeleteCategory') });
  }
};


  const openEditCategoryDialog = (category: Category) => {
    setSelectedCategory(category);
    setCategoryFormData({
      nameFr: category.nameFr,
      nameAr: category.nameAr,
      image: category.image,
      imageFile: null
    });
    setShowEditCategoryDialog(true);
  };

  const openProductsView = (category: Category) => {
  setSelectedCategory(category);
  setViewState({ mode: 'products', selectedCategory: category });
  loadProducts(String(category.id)); // convert number → string if loadProducts expects string
};


  // Product handlers
  const categoryProducts = viewState.selectedCategory
    ? products.filter(p => p.categoryId === viewState.selectedCategory.id)
    : [];

  const handleProductSelect = (product: Product) => {
    setSearchSelectedProduct(product);
    setProductFormData({
      nameFr: product.nameFr,
      nameAr: product.nameAr || '',
      price: product.price,
      descriptionFr: product.descriptionFr,
      descriptionAr: product.descriptionAr || '',
      image: product.image,
      quality: product.quality,
      barcode: product.barcode,
      imageFile: null
    });
    setShowProductForm(true);
  };

  const handleCreateProduct = async () => {
  try {
    let imageUrl = productFormData.image;
    if (productFormData.imageFile) {
      const res = await uploadFile(productFormData.imageFile);
      imageUrl = res.url;
    }

    const payload = {
      nameFr: productFormData.nameFr,
      nameAr: productFormData.nameAr,
      price: productFormData.price,
      descriptionFr: productFormData.descriptionFr,
      descriptionAr: productFormData.descriptionAr,
      image: imageUrl,
      quality: productFormData.quality,
      barcode: productFormData.barcode,
      categoryId: viewState.selectedCategory?.id ?? null,
    };

    const r = await fetch(`${API}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) throw new Error('create product failed');

    await loadProducts(viewState.selectedCategory?.id ?? '');

    toast({ title: t('productCreated') });
    resetProductForm();
    setShowCreateProductDialog(false);
  } catch (err) {
    console.error(err);
    toast({ title: 'Error', description: t('failedToCreateProduct') });
  }
};



  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    try {
      let imageUrl = productFormData.image;
      if (productFormData.imageFile) {
        const res = await uploadFile(productFormData.imageFile);
        imageUrl = res.url;
      }

      const payload = { ...productFormData, image: imageUrl };


      await fetch(`${API}/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await loadProducts(viewState.selectedCategory?.id);
      toast({ title: t('productSaved') });
      resetProductForm();
      setShowEditProductDialog(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToSaveProduct') });
    }
  };

const handleDeleteProduct = async (productId: number) => {
  try {
    await fetch(`${API}/api/products/${productId}`, { method: 'DELETE' });
    setProducts(products.filter(prod => prod.id !== productId));
    toast({ title: t('deleted') });
  } catch (err) {
    console.error(err);
    toast({ title: 'Error', description: t('failedToDeleteProduct') });
  }
};

  const openEditProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setProductFormData({
      nameFr: product.nameFr,
      nameAr: product.nameAr || '',
      price: product.price,
      descriptionFr: product.descriptionFr,
      descriptionAr: product.descriptionAr || '',
      image: product.image,
      quality: product.quality,
      barcode: product.barcode,
      imageFile: null
    });
    setShowEditProductDialog(true);
  };

  const resetProductForm = () => {
    setProductFormData({
      nameFr: '',
      nameAr: '',
      price: 0,
      descriptionFr: '',
      descriptionAr: '',
      image: '',
      quality: 5,
      barcode: '',
      imageFile: null
    });
    setShowProductForm(false);
    setSearchSelectedProduct(null);
  };

  // Special Offer handlers
  const handleCreateOffer = async () => {
    try {
      const newOffer = {
        name: offerFormData.name,
        description: offerFormData.description,
        endTime: offerFormData.endTime,
        isActive: true,
      };
      const r = await fetch(`${API}/api/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOffer)
      });
      if (!r.ok) throw new Error('Failed');
      await loadOffers();
      toast({ title: t('offerCreated') });
      setOfferFormData({ name: '', description: '', endTime: '' });
      setShowCreateOfferDialog(false);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToCreateOffer') });
    }
  };

  const handleEditOffer = async () => {
    if (!selectedOffer) return;
    try {
      const updatedOffer = {
        name: offerFormData.name,
        description: offerFormData.description,
        endTime: offerFormData.endTime,
      };
      await fetch(`${API}/api/offers/${selectedOffer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOffer)
      });
      await loadOffers();
      toast({ title: t('offerSaved') });
      setOfferFormData({ name: '', description: '', endTime: '' });
      setShowEditOfferDialog(false);
      setSelectedOffer(null);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToSaveOffer') });
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await fetch(`${API}/api/offers/${offerId}`, { method: 'DELETE' });
      setOffers(offers.filter(offer => offer.id !== offerId));
      toast({ title: t('deleted') });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToDeleteOffer') });
    }
  };

  const toggleOfferStatus = async (offer: SpecialOffer) => {
    try {
      await fetch(`${API}/api/offers/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...offer, isActive: !offer.isActive })
      });
      await loadOffers();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToChangeStatus') });
    }
  };

  const openEditOfferDialog = (offer: SpecialOffer) => {
    setSelectedOffer(offer);
    setOfferFormData({
      name: offer.name,
      description: offer.description,
      endTime: offer.endTime
    });
    setShowEditOfferDialog(true);
  };

  const openOfferProductsView = (offer: SpecialOffer) => {
    setSelectedOffer(offer);
    setViewState({ mode: 'offerProducts', selectedOffer: offer });
    loadOfferProducts(offer.id);
  };

  const formatEndTime = (endTime: string) => {
    const date = new Date(endTime);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} ${t('daysRemaining')}`;
    } else {
      return t('expired');
    }
  };

  // Offer Product handlers
 const currentOfferProducts = viewState.selectedOffer
  ? offerProducts.filter(p => Number(p.offerId) === Number(viewState.selectedOffer.id))
  : [];

  const handleOfferProductSelect = (product: Product) => {
    setSearchSelectedOfferProduct(product);
    setOfferProductFormData({
      nameFr: product.nameFr,
      nameAr: product.nameAr || '',
      price: product.price,
      newPrice: 0,
      savings: 0,
      percentage: 0,
      descriptionFr: product.descriptionFr,
      descriptionAr: product.descriptionAr || '',
      image: product.image,
      quality: product.quality,
      barcode: product.barcode,
      imageFile: null
    });
    setShowOfferProductForm(true);
  };

  const calculateSavingsAndPercentage = (originalPrice: number, newPrice: number) => {
    const savings = originalPrice - newPrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    return { savings, percentage };
  };

  const handleCreateOfferProduct = async () => {
    if (!viewState.selectedOffer) return;
    try {
      const { savings, percentage } = calculateSavingsAndPercentage(offerProductFormData.price, offerProductFormData.newPrice);
      let imageUrl = offerProductFormData.image;
      if (offerProductFormData.imageFile) {
        const res = await uploadFile(offerProductFormData.imageFile);
        imageUrl = res.url;
      }

      // include productId from searchSelectedOfferProduct or selected product
const payload = {
  productId: searchSelectedOfferProduct?.id ?? null,
  originalPrice: offerProductFormData.price,
  newPrice: offerProductFormData.newPrice,
  savings,
  percentage,
  // optionally include nameFr etc (for display only)
  nameFr: offerProductFormData.nameFr,
  image: imageUrl,
  offerId: viewState.selectedOffer.id
};

      const r = await fetch(`${API}/api/offers/${viewState.selectedOffer.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('create offer product failed');
      await loadOfferProducts(viewState.selectedOffer.id);
      toast({ title: t('productAddedToOffer') });
      resetOfferProductForm();
      setShowCreateOfferProductDialog(false);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToAddProductToOffer') });
    }
  };

  const handleEditOfferProduct = async () => {
    if (!selectedOfferProduct) return;
    try {
      const { savings, percentage } = calculateSavingsAndPercentage(offerProductFormData.price, offerProductFormData.newPrice);
      let imageUrl = offerProductFormData.image;
      if (offerProductFormData.imageFile) {
        const res = await uploadFile(offerProductFormData.imageFile);
        imageUrl = res.url;
      }

      const payload = { ...offerProductFormData, savings, percentage, image: imageUrl };

      await fetch(`${API}/api/offers/${selectedOfferProduct.offerId}/products/${selectedOfferProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await loadOfferProducts(selectedOfferProduct.offerId);
      toast({ title: t('offerProductSaved') });
      resetOfferProductForm();
      setShowEditOfferProductDialog(false);
      setSelectedOfferProduct(null);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToSaveOfferProduct') });
    }
  };

  const handleDeleteOfferProduct = async (productId: string) => {
    if (!viewState.selectedOffer) return;
    try {
      await fetch(`${API}/api/offers/${viewState.selectedOffer.id}/products/${productId}`, { method: 'DELETE' });
      setOfferProducts(offerProducts.filter(prod => prod.id !== productId));
      toast({ title: t('deleted') });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToDeleteOfferProduct') });
    }
  };

  const openEditOfferProductDialog = (product: OfferProduct) => {
    setSelectedOfferProduct(product);
    setOfferProductFormData({
      nameFr: product.nameFr,
      nameAr: product.nameAr || '',
      price: product.price,
      newPrice: product.newPrice,
      savings: product.savings,
      percentage: product.percentage,
      descriptionFr: product.descriptionFr,
      descriptionAr: product.descriptionAr || '',
      image: product.image,
      quality: product.quality,
      barcode: product.barcode,
      imageFile: null
    });
    setShowEditOfferProductDialog(true);
  };

  const resetOfferProductForm = () => {
    setOfferProductFormData({
      nameFr: '',
      nameAr: '',
      price: 0,
      newPrice: 0,
      savings: 0,
      percentage: 0,
      descriptionFr: '',
      descriptionAr: '',
      image: '',
      quality: 5,
      barcode: '',
      imageFile: null
    });
    setShowOfferProductForm(false);
    setSearchSelectedOfferProduct(null);
  };

  // Contact handlers
  const handleSaveContact = async () => {
    try {
      await fetch(`${API}/api/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      toast({
        title: t("contactInfoSaved"),
        description: t("contactInfoSavedDesc"),
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToSaveContact') });
    }
  };

  const updateContactField = (field: keyof Contact, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  const contactFields = [
    {
      key: 'phone' as keyof Contact,
      label: t('phone'),
      icon: Phone,
      placeholder: '+213 XXX XXX XXX',
      type: 'tel'
    },
    {
      key: 'whatsapp' as keyof Contact,
      label: t('whatsapp'),
      icon: MessageCircle,
      placeholder: '+213 XXX XXX XXX',
      type: 'tel'
    },
    {
      key: 'email' as keyof Contact,
      label: t('email'),
      icon: Mail,
      placeholder: 'contact@monsite.com',
      type: 'email'
    },
    {
      key: 'facebook' as keyof Contact,
      label: t('facebook'),
      icon: Facebook,
      placeholder: 'https://facebook.com/monsite',
      type: 'url'
    },
    {
      key: 'instagram' as keyof Contact,
      label: t('instagram'),
      icon: Instagram,
      placeholder: 'https://instagram.com/monsite',
      type: 'url'
    },
    {
      key: 'tiktok' as keyof Contact,
      label: t('tiktok'),
      icon: Music,
      placeholder: 'https://tiktok.com/@monsite',
      type: 'url'
    },
    {
      key: 'viber' as keyof Contact,
      label: t('viber'),
      icon: MessageCircle,
      placeholder: '+213 XXX XXX XXX',
      type: 'tel'
    },
    {
      key: 'mapUrl' as keyof Contact,
      label: t('mapUrl'),
      icon: MapPin,
      placeholder: 'https://maps.google.com/...',
      type: 'url'
    }
  ];

  // Settings handlers
  const handleSaveSettings = async () => {
    try {
      await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      toast({
        title: t("settingsSaved"),
        description: t("settingsSavedDesc"),
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: t('failedToSaveSettings') });
    }
  };

  const updateSettingsField = (field: keyof Settings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  // Product Form Component
  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {!isEdit && (
        <div className={`product-form-section transition-all duration-300 ${showProductForm ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchProductPlaceholder')}
              className="pl-10"
              onChange={(e) => {
                // Dummy logic for search
                const product = {
  id: Date.now(), // numeric dummy id
  nameFr: e.target.value,
  nameAr: '',
  price: 0,
  descriptionFr: '',
  descriptionAr: '',
  image: '',
  quality: 5,
  barcode: '',
  categoryId: viewState.selectedCategory?.id ?? null
};
handleProductSelect(product as Product);

              }}
            />
          </div>
        </div>
      )}

      {(showProductForm || isEdit) && (
        <div className="space-y-4 product-form-section animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nameFr" className="text-sm font-semibold">{t('productNameFr')}</Label>
              <Input
                id="nameFr"
                value={productFormData.nameFr}
                onChange={(e) => setCategoryFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                placeholder={t('productNameFrPlaceholder')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="nameAr" className="text-sm font-semibold">{t('productNameAr')}</Label>
              <Input
                id="nameAr"
                value={productFormData.nameAr}
                onChange={(e) => setProductFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                placeholder={t('productNameArPlaceholder')}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-semibold">{t('price')}</Label>
              <Input
                id="price"
                type="number"
                value={productFormData.price || ''}
                onChange={(e) => setProductFormData(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                placeholder={t('pricePlaceholder')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="barcode" className="text-sm font-semibold">{t('barcode')}</Label>
              <Input
                id="barcode"
                value={productFormData.barcode}
                onChange={(e) => setProductFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder={t('barcode')}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descriptionFr" className="text-sm font-semibold">{t('descriptionFr')}</Label>
            <Textarea
              id="descriptionFr"
              value={productFormData.descriptionFr}
              onChange={(e) => setProductFormData(prev => ({ ...prev, descriptionFr: e.target.value }))}
              placeholder={t('descriptionFrPlaceholder')}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="descriptionAr" className="text-sm font-semibold">{t('descriptionAr')}</Label>
            <Textarea
              id="descriptionAr"
              value={productFormData.descriptionAr}
              onChange={(e) => setProductFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
              placeholder={t('descriptionArPlaceholder')}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-sm font-semibold">{t('productImage')}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProductFormData(prev => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
                }
              }}
              className="mt-1"
            />
          </div>

          <div className="py-2">
            <StarRating
              rating={productFormData.quality}
              onRatingChange={(rating) => setProductFormData(prev => ({ ...prev, quality: rating }))}
              label={t('quality')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (isEdit) {
                  setShowEditProductDialog(false);
                } else {
                  setShowCreateProductDialog(false);
                }
                resetProductForm();
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={isEdit ? handleEditProduct : handleCreateProduct}
              className="bg-primary hover:bg-primary/90"
            >
              {isEdit ? t('save') : t('create')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // Offer Product Form Component
  const OfferProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {!isEdit && (
        <div className={`product-form-section transition-all duration-300 ${showOfferProductForm ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchOfferProductPlaceholder')}
              className="pl-10"
              onChange={(e) => {
                // Dummy logic for search
                const product = {
  id: Date.now(), // numeric dummy id
  nameFr: e.target.value,
  nameAr: '',
  price: 0,
  descriptionFr: '',
  descriptionAr: '',
  image: '',
  quality: 5,
  barcode: '',
  categoryId: viewState.selectedCategory?.id ?? null
};
handleOfferProductSelect(product as Product);

              }}
            />
          </div>
        </div>
      )}

      {(showOfferProductForm || isEdit) && (
        <div className="space-y-4 product-form-section animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nameFr" className="text-sm font-semibold">{t('productNameFr')}</Label>
              <Input
                id="nameFr"
                value={offerProductFormData.nameFr}
                onChange={(e) => setOfferProductFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                placeholder={t('productNameFrPlaceholder')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="nameAr" className="text-sm font-semibold">{t('productNameAr')}</Label>
              <Input
                id="nameAr"
                value={offerProductFormData.nameAr}
                onChange={(e) => setOfferProductFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                placeholder={t('productNameArPlaceholder')}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-semibold">{t('originalPrice')}</Label>
              <Input
                id="price"
                type="number"
                value={offerProductFormData.price || ''}
                onChange={(e) => {
                  const price = Number(e.target.value) || 0;
                  const updatedFormData = { ...offerProductFormData, price };
                  if (updatedFormData.newPrice > 0) {
                    const savings = Math.max(0, price - updatedFormData.newPrice);
                    const percentage = price > 0 ? Math.round((savings / price) * 100) : 0;
                    updatedFormData.savings = savings;
                    updatedFormData.percentage = percentage;
                  }
                  setOfferProductFormData(updatedFormData);
                }}
                placeholder={t('originalPricePlaceholder')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newPrice" className="text-sm font-semibold">{t('newPrice')}</Label>
              <Input
                id="newPrice"
                type="number"
                value={offerProductFormData.newPrice || ''}
                onChange={(e) => {
                  const newPrice = Number(e.target.value) || 0;
                  const updatedFormData = { ...offerProductFormData, newPrice };
                  if (updatedFormData.price > 0 && newPrice > 0) {
                    const savings = Math.max(0, updatedFormData.price - newPrice);
                    const percentage = Math.round((savings / updatedFormData.price) * 100);
                    updatedFormData.savings = savings;
                    updatedFormData.percentage = percentage;
                  } else {
                    updatedFormData.savings = 0;
                    updatedFormData.percentage = 0;
                  }
                  setOfferProductFormData(updatedFormData);
                }}
                placeholder={t('newPricePlaceholder')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="barcode" className="text-sm font-semibold">{t('barcode')}</Label>
              <Input
                id="barcode"
                value={offerProductFormData.barcode}
                onChange={(e) => setOfferProductFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder={t('barcode')}
                className="mt-1"
              />
            </div>
          </div>

          {offerProductFormData.price > 0 && offerProductFormData.newPrice > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border">
              <div className="text-center">
                <Label className="text-sm font-semibold text-green-600 dark:text-green-400">{t('savings')}</Label>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {offerProductFormData.savings.toLocaleString()} DZD
                </div>
              </div>
              <div className="text-center">
                <Label className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t('percentage')}</Label>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {offerProductFormData.percentage}%
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="descriptionFr" className="text-sm font-semibold">{t('descriptionFr')}</Label>
            <Textarea
              id="descriptionFr"
              value={offerProductFormData.descriptionFr}
              onChange={(e) => setOfferProductFormData(prev => ({ ...prev, descriptionFr: e.target.value }))}
              placeholder={t('descriptionFrPlaceholder')}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="descriptionAr" className="text-sm font-semibold">{t('descriptionAr')}</Label>
            <Textarea
              id="descriptionAr"
              value={offerProductFormData.descriptionAr}
              onChange={(e) => setOfferProductFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
              placeholder={t('descriptionArPlaceholder')}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-sm font-semibold">{t('productImage')}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setOfferProductFormData(prev => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
                }
              }}
              className="mt-1"
            />
          </div>

          <div className="py-2">
            <StarRating
              rating={offerProductFormData.quality}
              onRatingChange={(rating) => setOfferProductFormData(prev => ({ ...prev, quality: rating }))}
              label={t('quality')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (isEdit) {
                  setShowEditOfferProductDialog(false);
                } else {
                  setShowCreateOfferProductDialog(false);
                }
                resetOfferProductForm();
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={isEdit ? handleEditOfferProduct : handleCreateOfferProduct}
              className="bg-primary hover:bg-primary/90"
            >
              {isEdit ? t('save') : t('create')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // Render active section content
  const renderActiveSection = () => {
    const filteredCategoryProducts = categoryProducts.filter(product =>
      product.nameFr.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.barcode.includes(productSearchTerm)
    );
    const filteredOfferProducts = currentOfferProducts.filter(product =>
      product.nameFr.toLowerCase().includes(offerProductSearchTerm.toLowerCase()) ||
      product.barcode.includes(offerProductSearchTerm)
    );

    if (viewState.mode === 'products' && viewState.selectedCategory) {
      return (
        <div
          className={`space-y-6 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setViewState({ mode: 'overview' })}>
                <ArrowLeft size={20} className="mr-2" />
                {t('back')}
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('products')} - {viewState.selectedCategory.nameFr}
                </h2>
                <p className="text-muted-foreground">{viewState.selectedCategory.nameAr}</p>
              </div>
            </div>

            <Dialog open={showCreateProductDialog} onOpenChange={setShowCreateProductDialog}>
              <DialogTrigger asChild>
                <Button className="management-button">
                  <Plus size={20} className="mr-2" />
                  {t('addProduct')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('addNewProduct')}</DialogTitle>
                </DialogHeader>
                <ProductForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchProductPlaceholder')}
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategoryProducts.map((product, index) => (
              <Card
                key={product.id}
                className="p-4 transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-3">
                  <img
                    src={product.image}
                    alt={product.nameFr}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {product.nameFr}
                    </h4>
                    {product.nameAr && (
                      <p className="text-xs text-muted-foreground truncate">{product.nameAr}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-primary">
                        {product.price.toLocaleString()} DZD
                      </span>
                      <div className="flex">
                        <StarRating
                          rating={product.quality}
                          onRatingChange={() => { }}
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-1 h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEditProductDialog(product)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-1 h-8 w-8 text-destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-1 h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => alert(`Viewing details for product: ${product.nameFr}`)}

                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Dialog open={showEditProductDialog} onOpenChange={setShowEditProductDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('editProduct')} {selectedProduct?.nameFr}</DialogTitle>
              </DialogHeader>
              <ProductForm isEdit />
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    if (viewState.mode === 'offerProducts' && viewState.selectedOffer) {
      return (
        <div
          className={`space-y-6 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setViewState({ mode: 'overview' })}>
                <ArrowLeft size={20} className="mr-2" />
                {t('back')}
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('offerProducts')} - {viewState.selectedOffer.name}
                </h2>
                <p className="text-muted-foreground">{viewState.selectedOffer.description}</p>
              </div>
            </div>

            <Dialog open={showCreateOfferProductDialog} onOpenChange={setShowCreateOfferProductDialog}>
              <DialogTrigger asChild>
                <Button className="management-button">
                  <Plus size={20} className="mr-2" />
                  {t('addProductToOffer')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('addProductToOffer')}</DialogTitle>
                </DialogHeader>
                <OfferProductForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchOfferProductPlaceholder')}
              value={offerProductSearchTerm}
              onChange={(e) => setOfferProductSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfferProducts.map((product, index) => (
              <Card
                key={product.id}
                className="p-6 transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Badge variant="secondary" className="absolute top-4 right-4 text-xs font-bold bg-destructive text-destructive-foreground">
                  -{product.percentage}%
                </Badge>

                <div className="space-y-4">
                  <img
                    src={product.image}
                    alt={product.nameFr}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {product.nameFr}
                    </h4>
                    {product.nameAr && (
                      <p className="text-muted-foreground">{product.nameAr}</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            {product.newPrice.toLocaleString()} DZD
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.price.toLocaleString()} DZD
                          </span>
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {t('savings')}: {product.savings.toLocaleString()} DZD
                        </div>
                      </div>
                      <div className="flex">
                        <StarRating
                          rating={product.quality}
                          onRatingChange={() => { }}
                          readonly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditOfferProductDialog(product)}
                      className="flex-1"
                    >
                      <Edit size={16} className="mr-1" />
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteOfferProduct(product.id)}
                      className="flex-1 text-destructive hover:text-white hover:bg-destructive"
                    >
                      <Trash2 size={16} className="mr-1" />
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Dialog open={showEditOfferProductDialog} onOpenChange={setShowEditOfferProductDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('editOfferProduct')} {selectedOfferProduct?.nameFr}</DialogTitle>
              </DialogHeader>
              <OfferProductForm isEdit />
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    // Main overview sections
    switch (activeSection) {
      case 'categories':
        return (
          <div
            className={`space-y-6 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{t('categories')}</h2>

              <Dialog open={showCreateCategoryDialog} onOpenChange={setShowCreateCategoryDialog}>
                <DialogTrigger asChild>
                  <Button className="management-button">
                    <Plus size={20} className="mr-2" />
                    {t('creé Catégorie')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('creé Catégorie')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nameFr">{t('category Name Fr')}</Label>
                     <Input
  id="nameFr"
  value={categoryFormData.nameFr}
  onChange={(e) =>
    setCategoryFormData(prev => ({ ...prev, nameFr: e.target.value }))
  }
  placeholder={t('category Name Fr Placeholder')}
/>

                    </div>
                    <div>
                      <Label htmlFor="nameAr">{t('category Name Ar')}</Label>
                      <Input
                        id="nameAr"
                        value={categoryFormData.nameAr}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                        placeholder={t('category Name Arab Placeholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">{t('categoryImage')}</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCategoryFormData(prev => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateCategoryDialog(false)}
                      >
                        {t('cancel')}
                      </Button>
                      <Button onClick={handleCreateCategory}>
                        {t('create')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card
                  key={category.id}
                  className="p-6 transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <img
                      src={category.image}
                      alt={category.nameFr}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.nameFr}
                      </h3>
                      <p className="text-muted-foreground">{category.nameAr}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {category.productsCount} {t('products')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => openEditCategoryDialog(category)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => openProductsView(category)}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('editCategory')} {selectedCategory?.nameFr}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editNameFr">{t('categoryNameFr')}</Label>
                    <Input
  id="editNameFr"
  value={categoryFormData.nameFr}
  onChange={(e) =>
    setCategoryFormData(prev => ({ ...prev, nameFr: e.target.value }))
  }
/>

                  </div>
                  <div>
                    <Label htmlFor="editNameAr">{t('categoryNameAr')}</Label>
                    <Input
                      id="editNameAr"
                      value={categoryFormData.nameAr}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editImage">{t('categoryImage')}</Label>
                    <Input
                      id="editImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCategoryFormData(prev => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditCategoryDialog(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleEditCategory}>
                      {t('save')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'offers':
        const activeOffers = offers.filter(offer => offer.isActive);
        const inactiveOffers = offers.filter(offer => !offer.isActive);

        return (
          <div
            className={`space-y-6 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{t('specialOffers')}</h2>

              <Dialog open={showCreateOfferDialog} onOpenChange={setShowCreateOfferDialog}>
                <DialogTrigger asChild>
                  <Button className="management-button">
                    <Plus size={20} className="mr-2" />
                    {t('createOffer')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('createOffer')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('offerName')}</Label>
                      <Input
                        id="name"
                        value={offerFormData.name}
                        onChange={(e) => setOfferFormData({ ...offerFormData, name: e.target.value })}
                        placeholder={t('offerNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">{t('offerDescription')}</Label>
                      <Textarea
                        id="description"
                        value={offerFormData.description}
                        onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                        placeholder={t('offerDescriptionPlaceholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">{t('endDate')}</Label>
                      <Input
                        id="endTime"
                        type="datetime-local"
                        value={offerFormData.endTime}
                        onChange={(e) => setOfferFormData({ ...offerFormData, endTime: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateOfferDialog(false)}
                      >
                        {t('cancel')}
                      </Button>
                      <Button onClick={handleCreateOffer}>
                        {t('create')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Play size={20} className="text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-foreground">
                  {t('activeOffers')} ({activeOffers.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOffers.map((offer, index) => (
                  <Card
                    key={offer.id}
                    className="p-6 transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground">
                            {offer.name}
                          </h4>
                          <p className="text-muted-foreground text-sm mt-1">
                            {offer.description}
                          </p>
                        </div>
                        <Badge variant="default" className="px-2 py-1 bg-green-500 text-white hover:bg-green-600">{t('active')}</Badge>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="mr-2" />
                        {formatEndTime(offer.endTime)}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {offer.productsCount} {t('productsInThisOffer')}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditOfferDialog(offer)}
                        >
                          <Edit size={16} className="mr-1" />
                          {t('edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleOfferStatus(offer)}
                          className="text-orange-500 hover:text-white hover:bg-orange-500"
                        >
                          <Pause size={16} className="mr-1" />
                          {t('stop')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOfferProductsView(offer)}
                        >
                          <Eye size={16} className="mr-1" />
                          {t('products')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Pause size={20} className="text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground">
                  {t('inactiveOffers')} ({inactiveOffers.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveOffers.map((offer, index) => (
                  <Card
                    key={offer.id}
                    className="p-6 transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg opacity-75"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground">
                            {offer.name}
                          </h4>
                          <p className="text-muted-foreground text-sm mt-1">
                            {offer.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="px-2 py-1">{t('inactive')}</Badge>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="mr-2" />
                        {formatEndTime(offer.endTime)}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {offer.productsCount} {t('productsInThisOffer')}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditOfferDialog(offer)}
                        >
                          <Edit size={16} className="mr-1" />
                          {t('edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleOfferStatus(offer)}
                          className="text-green-600 hover:text-white hover:bg-green-600"
                        >
                          <Play size={16} className="mr-1" />
                          {t('activate')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="text-destructive hover:text-white hover:bg-destructive"
                        >
                          <Trash2 size={16} className="mr-1" />
                          {t('delete')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div >

            <Dialog open={showEditOfferDialog} onOpenChange={setShowEditOfferDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('editOffer')} {selectedOffer?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editName">{t('offerName')}</Label>
                    <Input
                      id="editName"
                      value={offerFormData.name}
                      onChange={(e) => setOfferFormData({ ...offerFormData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDescription">{t('offerDescription')}</Label>
                    <Textarea
                      id="editDescription"
                      value={offerFormData.description}
                      onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEndTime">{t('endDate')}</Label>
                    <Input
                      id="editEndTime"
                      type="datetime-local"
                      value={offerFormData.endTime}
                      onChange={(e) => setOfferFormData({ ...offerFormData, endTime: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditOfferDialog(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleEditOffer}>
                      {t('save')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'contacts':
        return (
          <div
            className={`space-y-6 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{t('contacts')}</h2>
              <Button onClick={handleSaveContact} className="management-button">
                <Save size={20} className="mr-2" />
                {t('save')}
              </Button>
            </div>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown size={20} className="text-primary" />
                  <span>{t('contactInfo')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactFields.map((field, index) => (
                    <div
                      key={field.key}
                      className="space-y-2 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Label htmlFor={field.key} className="flex items-center space-x-2">
                        <field.icon size={16} className="text-primary" />
                        <span>{field.label}</span>
                      </Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        value={contact[field.key]}
                        onChange={(e) => updateContactField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div
            className={`space-y-6 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{t('settings')}</h2>
              <Button onClick={handleSaveSettings} className="management-button">
                <Save size={20} className="mr-2" />
                {t('save')}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe size={20} className="text-primary" />
                    <span>{t('websiteName')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="animate-fade-in">
                      <Label htmlFor="siteNameFr">{t('siteNameFr')}</Label>
                      <Input
                        id="siteNameFr"
                        value={settings.siteNameFr}
                        onChange={(e) => updateSettingsField('siteNameFr', e.target.value)}
                        placeholder={t('siteNameFrPlaceholder')}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                      <Label htmlFor="siteNameAr">{t('siteNameAr')}</Label>
                      <Input
                        id="siteNameAr"
                        value={settings.siteNameAr}
                        onChange={(e) => updateSettingsField('siteNameAr', e.target.value)}
                        placeholder={t('siteNameArPlaceholder')}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText size={20} className="text-primary" />
                    <span>{t('websiteDescription')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                      <Label htmlFor="descriptionFr">{t('descriptionFr')}</Label>
                      <Textarea
                        id="descriptionFr"
                        value={settings.descriptionFr}
                        onChange={(e) => updateSettingsField('descriptionFr', e.target.value)}
                        placeholder={t('descriptionFrPlaceholder')}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                      />
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                      <Label htmlFor="descriptionAr">{t('descriptionAr')}</Label>
                      <Textarea
                        id="descriptionAr"
                        value={settings.descriptionAr}
                        onChange={(e) => updateSettingsField('descriptionAr', e.target.value)}
                        placeholder={t('descriptionArPlaceholder')}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-4">
      {/* Modern Navigation Bar */}
      <div className="bg-card/80 backdrop-blur-lg border border-border/60 rounded-3xl shadow-xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-border/30">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent tracking-tight">
                {t('websiteManagement')}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1">
                {t('websiteManagementSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-muted/30 to-muted/50 p-2 rounded-2xl border border-border/40">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  className={`relative group flex items-center space-x-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-500 transform ${activeSection === item.id
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105 translate-y-[-2px]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60 hover:shadow-md hover:scale-102'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    setActiveSection(item.id);
                    setViewState({ mode: 'overview' });
                  }}
                >
                  <div className={`p-1.5 rounded-lg transition-colors duration-300 ${activeSection === item.id
                      ? 'bg-primary-foreground/20'
                      : 'group-hover:bg-primary/10'
                    }`}>
                    <item.icon size={18} className={`transition-colors duration-300 ${activeSection === item.id
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                  </div>
                  <span className="font-semibold">{item.label}</span>

                  {/* Active state indicator */}
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl animate-pulse" />
                  )}

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${activeSection === item.id
                      ? 'opacity-100 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent'
                      : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/5 to-transparent'
                    }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Section Content */}
      <div className="animate-slide-in-right">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default WebsiteManage;
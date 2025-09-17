import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language } from "@/types"; // 'fr' | 'ar'

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  translations: Record<string, Record<Language, string>>;
}

// -------------------
// MERGED TRANSLATIONS
// -------------------
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  websiteManagement: { fr: "Gestion du Site Web", ar: "إدارة الموقع الإلكتروني" },
  orderManagement: { fr: "Gestion des Commandes", ar: "إدارة الطلبات" },

  "nav.dashboard": { fr: "Tableau de Bord", ar: "لوحة التحكم" },
  "nav.inventory": { fr: "Gestion du Stock", ar: "إدارة المخزون" },
  "nav.sales": { fr: "Ventes", ar: "المبيعات" },
  "nav.pos": { fr: "Point de Vente", ar: "نقطة البيع" },
  "nav.invoicing": { fr: "Facturation", ar: "الفوترة" },
  "nav.suppliers": { fr: "Fournisseurs", ar: "الموردين" },
  "nav.employees": { fr: "Employés", ar: "الموظفين" },
  "nav.website_manage": { fr: "Gestion du Site", ar: "إدارة الموقع" },
  "nav.website_commands": { fr: "Commandes du Site", ar: "طلبات الموقع" },
  "nav.reports": { fr: "Rapports", ar: "التقارير" },
  "nav.barcodes": { fr: "Codes Barres", ar: "الباركود" },
  "nav.settings": { fr: "Paramètres", ar: "الإعدادات" },

  // Sections
  categories: { fr: "Catégories", ar: "الفئات" },
  specialOffers: { fr: "Offres Spéciales", ar: "العروض الخاصة" },
  contacts: { fr: "Contacts", ar: "جهات الاتصال" },
  settings: { fr: "Paramètres", ar: "الإعدادات" },

  // Category management
  createCategory: { fr: "Créer une nouvelle catégorie", ar: "إنشاء فئة جديدة" },
  categoryNameFr: { fr: "Nom de la catégorie (français)", ar: "اسم الفئة (بالفرنسية)" },
  categoryNameAr: { fr: "Nom de la catégorie (arabe)", ar: "اسم الفئة (بالعربية)" },
  categoryImage: { fr: "Image de la catégorie", ar: "صورة الفئة" },

  // Product management
  productNameFr: { fr: "Nom du produit (français)", ar: "اسم المنتج (بالفرنسية)" },
  productNameAr: { fr: "Nom du produit (arabe)", ar: "اسم المنتج (بالعربية)" },
  price: { fr: "Prix (DZD)", ar: "السعر (دج)" },
  descriptionFr: { fr: "Description (français)", ar: "الوصف (بالفرنسية)" },
  descriptionAr: { fr: "Description (arabe)", ar: "الوصف (بالعربية)" },
  quality: { fr: "Qualité", ar: "الجودة" },

  // Special offers
  createOffer: { fr: "Créer une nouvelle offre", ar: "إنشاء عرض جديد" },
  offerName: { fr: "Nom de l'offre", ar: "اسم العرض" },
  offerDescription: { fr: "Description", ar: "الوصف" },
  offerEndTime: { fr: "Expire dans", ar: "ينتهي العرض خلال" },
  newPrice: { fr: "Nouveau prix", ar: "السعر الجديد" },
  savings: { fr: "Économies", ar: "المدخرات" },
  percentage: { fr: "Pourcentage", ar: "النسبة المئوية" },

  // Orders
  clientName: { fr: "Nom du client", ar: "اسم العميل" },
  phoneNumber: { fr: "Numéro de téléphone", ar: "رقم الهاتف" },
  status: { fr: "Statut", ar: "الحالة" },
  pending: { fr: "En attente", ar: "قيد الانتظار" },
  confirmed: { fr: "Confirmé", ar: "مؤكد" },
  completed: { fr: "Terminé", ar: "مكتمل" },
  total: { fr: "Total", ar: "المجموع" },

  // Common actions
  create: { fr: "Créer", ar: "إنشاء" },
  edit: { fr: "Modifier", ar: "تحرير" },
  delete: { fr: "Supprimer", ar: "حذف" },
  save: { fr: "Enregistrer", ar: "حفظ" },
  cancel: { fr: "Annuler", ar: "إلغاء" },
  view: { fr: "Voir", ar: "عرض" },
  add: { fr: "Ajouter", ar: "إضافة" },
  search: { fr: "Rechercher", ar: "بحث" },
  active: { fr: "Actif", ar: "نشط" },
  inactive: { fr: "Inactif", ar: "غير نشط" },

  // Settings
  "settings.title": { fr: "Paramètres", ar: "الإعدادات" },
  "settings.subtitle": { fr: "Configurez votre application", ar: "قم بتكوين التطبيق الخاص بك" },
  "settings.backup": { fr: "Sauvegarde", ar: "نسخ احتياطي" },
  "settings.restore": { fr: "Restaurer", ar: "استعادة" },
  "settings.language": { fr: "Langue de l'interface", ar: "لغة الواجهة" },
  "settings.language_desc": { fr: "Choisissez la langue d'affichage", ar: "اختر لغة العرض" },
  "settings.theme": { fr: "Thème", ar: "المظهر" },
  "settings.theme_desc": { fr: "Mode d'affichage de l'interface", ar: "وضع عرض الواجهة" },
  "settings.light": { fr: "Clair", ar: "فاتح" },
  "settings.dark": { fr: "Sombre", ar: "داكن" },
  "settings.system": { fr: "Système", ar: "النظام" },

  // User
  "user.administrator": { fr: "Administrateur", ar: "مدير" },
  "user.logout": { fr: "Déconnexion", ar: "تسجيل الخروج" },

  // Notifications
  "notifications.title": { fr: "Notifications", ar: "الإشعارات" },
  "notifications.mark_read": { fr: "Marquer comme lu", ar: "تعليم كمقروء" },
  "notifications.view_all": { fr: "Voir toutes", ar: "عرض الكل" },
};

// -------------------
// CONTEXT
// -------------------
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "fr";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["fr"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook: full access
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

// Hook: translation only
export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};

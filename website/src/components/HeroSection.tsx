import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-image.jpg';
import { toast } from '@/hooks/use-toast';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

interface WebsiteSettingsResponse {
  site_name_fr: string;
  site_name_ar: string;
  description_fr: string;
  description_ar: string;
  logo_url: string | null;
}

// ✅ use env for assets (works in dev + prod)
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE || '';

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<WebsiteSettingsResponse>({
    site_name_fr: '',
    site_name_ar: '',
    description_fr: '',
    description_ar: '',
    logo_url: null,
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings'); // ✅ proxied to backend
      if (!res.ok) throw new Error('Failed to fetch');
      const data: WebsiteSettingsResponse = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching website settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les informations du site',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const siteName = language === 'fr' ? settings.site_name_fr : settings.site_name_ar;
  const siteDescription = language === 'fr' ? settings.description_fr : settings.description_ar;

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* ✅ Dynamic Logo */}
          {settings.logo_url && (
            <div className="mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white/50 animate-fade-in">
              <img
                src={`${ASSET_BASE}${settings.logo_url}`}
                alt="Site Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Welcome Text */}
          <div className="mb-6 fade-in">
            <p className="text-lg md:text-xl font-medium text-white/90 mb-2">{t('welcome')}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{siteName}</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
              {siteDescription}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-in-right">
            <Button
              variant="accent"
              size="lg"
              onClick={() => onNavigate('categories')}
              className="px-8 py-3 text-lg font-semibold min-w-[200px]"
            >
              {t('shopNow')}
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={() => onNavigate('categories')}
              className="px-8 py-3 text-lg font-semibold min-w-[200px] bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
            >
              {t('viewCategories')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

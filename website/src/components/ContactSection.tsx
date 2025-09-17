import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MessageCircle, Mail, MapPin, Clock, Star } from 'lucide-react';

interface ContactSectionProps {
  onNavigate: (section: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const contactMethods = [
    {
      icon: Phone,
      title: 'الهاتف',
      titleFr: 'Téléphone',
      value: '0555 123 456',
      description: 'متاح من السبت إلى الخميس',
      descriptionFr: 'Disponible du samedi au jeudi',
      action: 'tel:0555123456',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'واتساب',
      titleFr: 'WhatsApp',
      value: '0666 789 012',
      description: 'متاح 24/7 للرد السريع',
      descriptionFr: 'Disponible 24/7 pour réponse rapide',
      action: 'https://wa.me/213666789012',
      color: 'text-green-500'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      titleFr: 'Email',
      value: 'info@nasser-equipments.dz',
      description: 'للاستفسارات التفصيلية',
      descriptionFr: 'Pour demandes détaillées',
      action: 'mailto:info@nasser-equipments.dz',
      color: 'text-blue-600'
    }
  ];

  const workingHours = [
    { day: 'السبت - الخميس', dayFr: 'Samedi - Jeudi', hours: '08:00 - 18:00' },
    { day: 'الجمعة', dayFr: 'Vendredi', hours: 'مغلق' }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('contact')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لمساعدتك في العثور على المنتجات المناسبة وتقديم أفضل خدمة لك
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8 slide-in-left">
            <div className="card-elevated p-8">
              <h3 className="text-2xl font-bold mb-6">طرق التواصل</h3>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => window.open(method.action, '_blank')}
                  >
                    <div className={`p-3 rounded-full bg-background shadow-sm ${method.color}`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {method.title}
                      </h4>
                      <p className="text-lg font-medium text-primary mb-2">
                        {method.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="card-elevated p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                ساعات العمل
              </h3>
              <div className="space-y-3">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-primary font-bold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About & Location */}
          <div className="space-y-8 slide-in-right">
            {/* About Store */}
            <div className="card-elevated p-8">
              <h3 className="text-2xl font-bold mb-6">{t('aboutTitle')}</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('aboutText')}
                </p>
                <p>
                  نتميز بتوفير مجموعة واسعة من قطع الغيار والمعدات لجميع القطاعات:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>قطع غيار السيارات والشاحنات</li>
                  <li>المعدات الصناعية والهيدروليكية</li>
                  <li>الأدوات اليدوية والكهربائية</li>
                  <li>المكونات الإلكترونية والكهربائية</li>
                </ul>
              </div>

              {/* Customer Reviews */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold mb-4">آراء العملاء</h4>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground mr-2">- أحمد م.</span>
                    </div>
                    <p className="text-sm">"خدمة ممتازة ومنتجات عالية الجودة. أنصح بالتعامل معهم."</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground mr-2">- فاطمة ل.</span>
                    </div>
                    <p className="text-sm">"سرعة في التوصيل وأسعار منافسة. متجر موثوق."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card-elevated p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                موقعنا
              </h3>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">العنوان</p>
                  <p className="text-muted-foreground">
                    شارع الاستقلال، حي الصناعة<br />
                    الجزائر العاصمة، الجزائر
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">التغطية</p>
                  <p className="text-muted-foreground">
                    نقوم بالتوصيل لجميع أنحاء الجزائر
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center fade-in">
          <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              جاهزون لخدمتك
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              تواصل معنا الآن للحصول على استشارة مجانية أو طلب عرض سعر خاص لمشروعك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="lg"
                onClick={() => window.open('tel:0555123456')}
                className="px-8 py-3"
              >
                <Phone className="h-5 w-5 mr-2" />
                اتصل بنا الآن
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => onNavigate('order')}
                className="bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm px-8 py-3"
              >
                تقديم طلب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
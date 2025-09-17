import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Truck,
  BarChart3,
  Settings,
  Calculator,
  QrCode,
  Globe,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  // ✅ Navigation items reordered + new buttons
  const navigationItems = [
    { title: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { title: t('nav.inventory'), href: '/inventory', icon: Package },
    { title: t('nav.suppliers'), href: '/suppliers', icon: Truck },
    { title: t('nav.invoicing'), href: '/invoicing', icon: FileText },
    { title: t('nav.pos'), href: '/pos', icon: Calculator },
    { title: t('nav.sales'), href: '/sales', icon: ShoppingCart },
    { title: t('nav.employees'), href: '/employees', icon: Users },
    { title: t('nav.website_manage'), href: '/website-manage', icon: Globe },
    { title: t('nav.website_commands'), href: '/website-commands', icon: ClipboardList },
    { title: t('nav.reports'), href: '/reports', icon: BarChart3 },
    { title: t('nav.barcodes'), href: '/barcodes', icon: QrCode },
    { title: t('nav.settings'), href: '/settings', icon: Settings }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        `bg-card border-${isRTL ? 'l' : 'r'} border-border transition-all duration-300 flex flex-col shadow-lg hover-lift`,
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm animate-scale-in">
            KA
          </div>
          {isOpen && (
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="font-bold text-lg text-gradient animate-slide-up">Nasser</h1>
              <p className="text-xs text-muted-foreground animate-fade-in">
                Equipements et Materiel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8 custom-scrollbar overflow-y-auto">
        <div>
          {isOpen && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 animate-fade-in">
              Navigation
            </h3>
          )}
          <div className="sidebar-nav">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'sidebar-nav-item group hover:scale-105 transition-all duration-200',
                    isActive && 'active shadow-md'
                  )}
                  title={!isOpen ? item.title : undefined}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? 'animate-scale-in'
                        : 'group-hover:rotate-6 transition-transform'
                    }`}
                  />
                  {isOpen && <span className="animate-fade-in">{item.title}</span>}
                  {isActive && (
                    <div
                      className={`absolute ${
                        isRTL ? 'left-0' : 'right-0'
                      } top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-full animate-scale-in`}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border bg-gradient-to-r from-muted/20 to-muted/10">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm animate-scale-in">
            AK
          </div>
          {isOpen && (
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-sm font-medium truncate animate-fade-in">Nasser</p>
              <p className="text-xs text-muted-foreground animate-fade-in">
                {t('user.administrator')}
              </p>
            </div>
          )}
        </div>
        {isOpen && (
          <div className="mt-2 flex justify-center">
            <div className="w-8 h-1 bg-gradient-primary rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

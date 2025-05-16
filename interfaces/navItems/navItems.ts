import { ComponentType } from 'react';

export interface NavItem {
    name?: string;
    href: string;
    icon: ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface AdminNavbarDesktopProps {
    navItems: NavItem[];
    pathname: string;
}

export interface AdminNavbarMobileProps extends AdminNavbarDesktopProps {
    isMobileMenuOpen: boolean;
    onToggleMenu: () => void;
}

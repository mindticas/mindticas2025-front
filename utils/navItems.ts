import {
    BarChart,
    Calendar,
    Scissors,
    UserCog,
    Users,
    Settings,
    ShoppingBasket,
} from 'lucide-react';

export const navItems = [
    { name: 'Citas', href: '/admin/', icon: Calendar },
    { name: 'Clientes', href: '/admin/clients', icon: Users },
    { name: 'Empleados', href: '/admin/employees', icon: UserCog },
    { name: 'Tratamientos', href: '/admin/treatments', icon: Scissors },
    { name: 'Reportes', href: '/admin/reports', icon: BarChart },
    { name: 'Productos', href: '/admin/products', icon: ShoppingBasket },
    { href: '/admin/settings', icon: Settings },
];

import { BarChart, Calendar, Scissors, UserCog, Users } from 'lucide-react';

export const navItems = [
    { name: 'Citas', href: '/admin/', icon: Calendar },
    { name: 'Clientes', href: '/admin/clients', icon: Users },
    { name: 'Empleados', href: '/admin/employees', icon: UserCog },
    { name: 'Tratamientos', href: '/admin/treatments', icon: Scissors },
    { name: 'Reportes', href: '/admin/reports', icon: BarChart },
];

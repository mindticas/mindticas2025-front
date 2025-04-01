import { BarChart, Calendar, Scissors, UserCog, Users } from "lucide-react";

export const navItems = [
    { name: 'Citas', href: '/admin/', icon: Calendar },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Empleados', href: '/admin/empleados', icon: UserCog },
    { name: 'Tratamientos', href: '/admin/tratamientos', icon: Scissors },
    { name: 'Reportes', href: '/admin/reportes', icon: BarChart },
  
];
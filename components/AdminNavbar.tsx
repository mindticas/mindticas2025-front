'use client';
import { navItems } from '@/utils/navItems';
import { useBreakpointValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import AdminNavbarDesktop from './AdminNavbarDesktop';
import AdminNavbarMobile from './AdminNavbarMobile';

export default function AdminNavbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isDesktop = useBreakpointValue({ base: false, md: true });

    const handleToggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

    return isDesktop ? (
        <AdminNavbarDesktop navItems={navItems} pathname={pathname} />
    ) : (
        <AdminNavbarMobile
            navItems={navItems}
            pathname={pathname}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMenu={handleToggleMenu}
        />
    );
}

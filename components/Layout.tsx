import AdminNavbar from '@/pages/admin/AdminNavbar';
import React, { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AdminNavbar />
            <main>{children}</main>
        </div>
    );
}

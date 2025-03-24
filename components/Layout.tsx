// components/Layout.tsx
import React from 'react';
import AdminNavbar from './AdminNavbar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AdminNavbar />
            <main>{children}</main>
        </div>
    );
}

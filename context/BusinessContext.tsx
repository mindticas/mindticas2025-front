'use client';

import { UserProfile } from '@/interfaces/userProfile/userProfile';
import { getUserProfile } from '@/services/userProfileService';
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';

interface BusinessInfo {
    name: string;
    address: string;
    phone: string;
    instagram?: string;
}

interface BusinessContextType {
    businessInfo: BusinessInfo;
    setBusinessInfo: (info: BusinessInfo) => void;
    isLoading: boolean;
}

export const BusinessContext = createContext<BusinessContextType | undefined>(
    undefined,
);

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
};

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
        name: '',
        address: '',
        phone: '',
        instagram: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchUserProfile = async () => {
        setIsLoading(true);

        try {
            const data = await getUserProfile();
            if (!Array.isArray(data) || data.length === 0) {
                console.error('No se encontró perfil del negocio');
                return;
            }
            const profile: UserProfile = data[0];
            setBusinessInfo({
                name: profile.name ?? '',
                address: profile.contactDetails?.address ?? '',
                phone: profile.contactDetails?.phone ?? '',
                instagram: profile.socialLinks?.instagram ?? '',
            });
        } catch (error) {
            console.error('Error al cargar el perfil del usuario', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <BusinessContext.Provider
            value={{ businessInfo, setBusinessInfo, isLoading }}
        >
            {children}
        </BusinessContext.Provider>
    );
};
export type { BusinessInfo };

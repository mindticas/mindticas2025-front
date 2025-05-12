import { BusinessInfo } from '@/context/BusinessContext';
import { toaster } from '@/components/ui/toaster';

export interface BusinessFormData {
    name: string;
    contactDetails: {
        address: string;
        phone: string;
    };
    socialLinks: {
        instagram: string;
    };
}

export const validateBusinessFields = (
    formData: BusinessFormData,
): { isValid: boolean; error?: string } => {
    if (
        !formData.name.trim() ||
        !formData.contactDetails.address.trim() ||
        !formData.contactDetails.phone.trim() ||
        !formData.socialLinks.instagram.trim()
    ) {
        return { isValid: false, error: 'Todos los campos son obligatorios.' };
    }
    return { isValid: true };
};

export const hasBusinessFormChanges = (
    original: BusinessInfo,
    edited: BusinessFormData,
): boolean => {
    return (
        original.name !== edited.name ||
        original.address !== edited.contactDetails.address ||
        original.phone !== edited.contactDetails.phone ||
        original.instagram !== edited.socialLinks.instagram
    );
};

export const showBusinessNotification = {
    noChanges: () => {
        toaster.create({
            type: 'info',
            title: 'No se han detectado cambios.',
            duration: 4000,
        });
    },
    validationError: (message: string) => {
        toaster.create({
            type: 'error',
            title: message,
        });
    },
    saveError: () => {
        toaster.create({
            type: 'error',
            title: 'Ocurrió un error al guardar los datos. Intente de nuevo',
            duration: 4000,
        });
    },
    saveSuccess: () => {
        toaster.create({
            type: 'success',
            title: 'Cambios guardados correctamente',
            duration: 4000,
        });
    },
};

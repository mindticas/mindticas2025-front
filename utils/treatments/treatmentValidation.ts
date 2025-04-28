import { toaster } from '@/components/ui/toaster';
import TreatmentNotification from '../notifications';

export interface TreatmentFormData {
    name: string;
    description: string;
    price: number;
    duration: number;
}

export const validateTreatmentFields = (
    formData: TreatmentFormData,
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.description.trim())
        errors.description = 'La descripción es requerida';
    if (formData.price <= 0) errors.price = 'El precio debe ser mayor que 0';
    if (formData.duration <= 0)
        errors.duration = 'La duración debe ser mayor que 0';
    return errors;
};

export const hasTreatmentChanges = (
    original: TreatmentFormData,
    edited: TreatmentFormData,
): boolean => {
    return (
        original.name !== edited.name ||
        original.description !== edited.description ||
        original.price !== edited.price ||
        original.duration !== edited.duration
    );
};

export const showNoChangesToast = () => {
    TreatmentNotification.noChanges();
};

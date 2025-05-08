import { toaster } from '@/components/ui/toaster';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOption {
    duration?: number;
    title: string;
    description?: string;
}

const showToast = (type: ToastType, options: ToastOption) => {
    toaster.create({
        type,
        duration: options.duration || 5000,
        title: options.title,
        description: options.description,
    });
};

const TreatmentNotification = {
    createSuccess: () =>
        showToast('success', { title: 'Tratamiento creado con éxito' }),
    updateSuccess: () =>
        showToast('success', { title: 'Tratamiento actualizado con éxito' }),
    deleteSuccess: () =>
        showToast('success', { title: 'Tratamiento eliminado con éxito' }),
    createError: (message?: string) =>
        showToast('error', {
            title: message || 'Error al crear el tratamiento',
        }),
    updateError: (message?: string) =>
        showToast('error', {
            title: message || 'Error al actualizar el tratamiento0',
        }),
    deleteError: () =>
        showToast('error', { title: 'Error al eliminar el tratamiento' }),
    noChanges: () =>
        showToast('info', {
            title: 'No se detectaron cambios para actualizar',
        }),
};

export default TreatmentNotification;

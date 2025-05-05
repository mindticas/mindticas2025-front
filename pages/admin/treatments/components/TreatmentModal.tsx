import { Treatment } from '@/interfaces/treatment/Treatment';
import { validateTreatmentFields } from '@/utils/treatments/treatmentValidation';
import {
    Button,
    CloseButton,
    Dialog,
    DialogPositioner,
    Portal,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TreatmentForm from './TreatmentForm';

export type ModalMode = 'create' | 'edit' | 'cancel' | 'delete';
export type TreatmentModalEvent = {
    type: 'create' | 'update' | 'delete' | 'cancel';
    treatment?: Omit<Treatment, 'id'>;
    treatmentId?: string | number;
};

interface TreatmentModalProps {
    onEvent: (e: TreatmentModalEvent) => Promise<void>;
    isSubmitting: boolean;
    trigger?: {
        action: 'open' | 'close';
        mode?: ModalMode;
        treatment?: Treatment;
    };
}

const MODE_TITLES = {
    create: 'Nuevo tratamiento',
    edit: 'Editar tratamiento',
    delete: 'Eliminar tratamiento',
    cancel: 'Tratamiento',
};

export default function TreatmentModal({
    onEvent,
    isSubmitting,
    trigger,
}: TreatmentModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ModalMode>('create');
    const [selectedTreatment, setSelectedTreatment] = useState<
        Treatment | undefined
    >();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update internal state when props change
    useEffect(() => {
        if (!trigger) return;
        if (trigger.action === 'open') {
            setIsOpen(true);
            setMode(trigger.mode ?? 'create');
            setSelectedTreatment(trigger.treatment);
        } else {
            setIsOpen(false);
        }
    }, [trigger]);

    useEffect(() => {
        if (isOpen) {
            setErrors({});
        }
        if (isOpen && mode === 'edit' && selectedTreatment) {
            setFormData({
                name: selectedTreatment.name,
                description: selectedTreatment.description,
                price: selectedTreatment.price,
                duration: selectedTreatment.duration,
            });
            return;
        }
        if (mode === 'create') {
            setFormData({
                name: '',
                description: '',
                price: 0,
                duration: 0,
            });
        }
    }, [isOpen, mode, selectedTreatment]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        // clean errors
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value,
        });
    };

    const handleSubmit = async () => {
        if (mode === 'create' || mode === 'edit') {
            // Field validation
            const fieldErrors = validateTreatmentFields(formData);
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
                return;
            }
            if (mode === 'create') {
                await onEvent({ type: 'create', treatment: formData });
            } else if (mode === 'edit' && selectedTreatment) {
                await onEvent({
                    type: 'update',
                    treatment: formData,
                    treatmentId: selectedTreatment.id,
                });
            }
        } else if (mode === 'delete' && selectedTreatment) {
            await onEvent({
                type: 'delete',
                treatmentId: selectedTreatment.id,
            });
        }
        if (!isSubmitting) {
            setIsOpen(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setErrors({});
        onEvent({ type: 'cancel' });
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={({ open }) => !open && handleClose()}
            placement='center'
        >
            <Portal>
                <Dialog.Backdrop />
                <DialogPositioner>
                    <Dialog.Content p={5} backgroundColor='white'>
                        <Dialog.Header
                            mb={4}
                            display='flex'
                            justifyContent='space-between'
                            alignContent='center'
                        >
                            <Dialog.Title>
                                {MODE_TITLES[mode] ?? 'Tratamiento'}
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            {mode === 'create' || mode === 'edit' ? (
                                <TreatmentForm
                                    formData={formData}
                                    errors={errors}
                                    onInputChange={handleInputChange}
                                />
                            ) : mode === 'delete' ? (
                                <Text>
                                    ¿Estás seguro que deseas eliminar el
                                    tratamiento "{selectedTreatment?.name}" Esta
                                    acción no se puede deshacer.
                                </Text>
                            ) : (
                                <></>
                            )}
                        </Dialog.Body>
                        <Dialog.Footer p={4}>
                            <Button
                                backgroundColor={
                                    mode === 'delete' ? 'black' : 'red'
                                }
                                p={3}
                                color='white'
                                onClick={handleClose}
                            >
                                {mode === 'delete' ? 'Cancelar' : 'Cancelar'}
                            </Button>
                            <Button
                                backgroundColor={
                                    mode === 'delete' ? 'red' : '#1C4ED8'
                                }
                                p={3}
                                color='white'
                                onClick={handleSubmit}
                                loading={isSubmitting}
                            >
                                {mode === 'create'
                                    ? 'Crear'
                                    : mode === 'edit'
                                    ? 'Actualizar'
                                    : 'Eliminar'}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </DialogPositioner>
            </Portal>
        </Dialog.Root>
    );
}

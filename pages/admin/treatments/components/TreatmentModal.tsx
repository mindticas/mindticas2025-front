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

interface TreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'cancel' | 'delete';
    selectedTreatment?: Treatment;
    onTreatmentCreated?: () => void;
    onSubmit: (treatmentData?: Omit<Treatment, 'id'>) => Promise<void>;
    isSubmitting: boolean;
}

const MODE_TITLES = {
    create: 'Nuevo tratamiento',
    edit: 'Editar tratamiento',
    delete: 'Eliminar tratamiento',
    cancel: 'Tratamiento',
};

export default function TreatmentModal({
    isOpen,
    onClose,
    mode,
    selectedTreatment,
    onSubmit,
    isSubmitting,
}: TreatmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleSubmit = () => {
        if (mode === 'create' || mode === 'edit') {
            // Field validation
            const fieldErrors = validateTreatmentFields(formData);
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
                return;
            }
            onSubmit(formData);
        } else if (mode === 'delete') {
            onSubmit();
        }
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={({ open }) => !open && onClose()}
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
                                onClick={() => {
                                    onClose();
                                    setErrors({});
                                }}
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

import ErrorMessage from '@/components/ErrorMessage';
import { Treatment } from '@/interfaces/treatment/Treatment';
import { validateTreatmentFields } from '@/utils/treatments/treatmentValidation';
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    DialogPositioner,
    Field,
    Input,
    Portal,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface TreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'cancel' | 'delete';
    selectedTreatment?: Treatment;
    onTreatmentCreated?: () => void;
    onSubmit: (treatmentData?: Omit<Treatment, 'id'>) => Promise<void>;
    isSubmitting: boolean;
}

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

    const getTitle = () => {
        switch (mode) {
            case 'create':
                return 'Nuevo tratamiento';
            case 'edit':
                return 'Editar tratamiento';
            case 'delete':
                return 'Eliminar tratamiento';
            default:
                return 'Tratamiento';
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
                            <Dialog.Title>{getTitle()}</Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            {mode === 'create' || mode === 'edit' ? (
                                <form>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Nombre
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                name='name'
                                                placeholder='Nombre del tratamiento'
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <ErrorMessage
                                                message={errors.name}
                                            />
                                        </Field.Root>
                                    </Box>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Descripción
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                name='description'
                                                placeholder='Descripción'
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <ErrorMessage
                                                message={errors.description}
                                            />
                                        </Field.Root>
                                    </Box>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Precio
                                            </Field.Label>
                                            <Input
                                                type='number'
                                                p={2}
                                                name='price'
                                                placeholder='Precio'
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <ErrorMessage
                                                message={errors.price}
                                            />
                                        </Field.Root>
                                    </Box>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Duración
                                            </Field.Label>
                                            <Input
                                                type='number'
                                                p={2}
                                                name='duration'
                                                placeholder='Duración'
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <ErrorMessage
                                                message={errors.duration}
                                            />
                                        </Field.Root>
                                    </Box>
                                </form>
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

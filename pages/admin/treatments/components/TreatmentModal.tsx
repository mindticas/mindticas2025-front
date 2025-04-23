import { toaster, Toaster } from '@/components/ui/toaster';
import { Treatment } from '@/interfaces/treatment/Treatment';
import { createTreatment } from '@/services/TreatmentService';
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
    treatments: Treatment[];
    selectedTreatment?: Treatment;
    onTreatmentCreated?: () => void;
    onSubmit: (treatmentData: Omit<Treatment, 'id'>) => Promise<void>;
    isSubmitting: boolean;
}

export default function TreatmentModal({
    isOpen,
    onClose,
    mode,
    treatments,
    selectedTreatment,
    onSubmit,
}: TreatmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 0,
    });

    useEffect(() => {
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
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value,
        });
    };

    const handleSubmit = () => {
        if (mode === 'create' || mode === 'edit') {
            onSubmit(formData);
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
                            <Dialog.CloseTrigger>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            {/* Add validation if is a new treatment  */}
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
                            >
                                {mode === 'delete' ? 'Cancelar' : 'Volver'}
                            </Button>
                            <Button
                                backgroundColor={
                                    mode === 'delete' ? 'red' : '#1C4ED8'
                                }
                                p={3}
                                color='white'
                                onClick={handleSubmit}
                            >
                                {mode === 'create' ? 'Crear' : 'Actualizar'}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </DialogPositioner>
            </Portal>
        </Dialog.Root>
    );
}

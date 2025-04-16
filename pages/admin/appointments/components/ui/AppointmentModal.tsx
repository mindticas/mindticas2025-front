'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    Portal,
    Box,
    Input,
    Button,
    Text,
    Field,
    Spinner,
    SelectRoot,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectLabel,
    CloseButton,
} from '@chakra-ui/react';
import { Treatment } from '@/interfaces/treatment/Treatment';
import { createListCollection } from '@chakra-ui/react';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'cancel';
    treatments: Treatment[];
    initialData?: {
        id?: number;
        name: string;
        treatment: string;
        date: string;
        time: string;
    };
    onConfirm: (data: {
        id?: number;
        name: string;
        treatment: string;
        date: string;
        time: string;
    }) => Promise<void>;
    onCancel?: (id: number) => Promise<void>;
}

export default function AppointmentModal({
    isOpen,
    onClose,
    mode,
    treatments,
    initialData = {
        name: '',
        treatment: '',
        date: '',
        time: '',
    },
    onConfirm,
    onCancel,
}: AppointmentModalProps) {
    const [formData, setFormData] = useState({
        name: initialData.name,
        treatment: initialData.treatment,
        date: initialData.date,
        time: initialData.time,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: initialData.name,
                treatment: initialData.treatment,
                date: initialData.date,
                time: initialData.time,
            });
        }
    }, [
        isOpen,
        initialData.id,
        initialData.name,
        initialData.treatment,
        initialData.date,
        initialData.time,
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onConfirm({
                id: initialData?.id,
                ...formData,
            });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (mode === 'cancel' && initialData?.id && onCancel) {
            setIsLoading(true);
            try {
                await onCancel(initialData.id);
                onClose();
            } finally {
                setIsLoading(false);
            }
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
                <Dialog.Positioner>
                    <Dialog.Content p={5} backgroundColor='white'>
                        <Dialog.Header
                            mb={4}
                            display='flex'
                            justifyContent='space-between'
                            alignContent='center'
                        >
                            <Dialog.Title>
                                {mode === 'cancel'
                                    ? 'Confirmar cancelación'
                                    : mode === 'edit'
                                    ? 'Editar Cita'
                                    : 'Nueva Cita'}
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            {mode !== 'cancel' ? (
                                <form onSubmit={handleSubmit}>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Nombre
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                name='name'
                                                placeholder='Nombre del Cliente'
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>

                                    <Box mb={4}>
                                        {treatments && (
                                            <SelectRoot
                                                name='treatment'
                                                collection={createListCollection(
                                                    {
                                                        items: treatments,
                                                    },
                                                )}
                                                onValueChange={(e) => {
                                                    const selectedTreatment =
                                                        treatments.find(
                                                            (treatment) =>
                                                                treatment.name ===
                                                                e.value.toString(),
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        treatment:
                                                            selectedTreatment
                                                                ? selectedTreatment.id.toString()
                                                                : '',
                                                    });
                                                }}
                                                required
                                            >
                                                <SelectLabel fontWeight='semibold'>
                                                    Servicio a realizar
                                                </SelectLabel>
                                                <SelectTrigger>
                                                    {(treatments &&
                                                        treatments.find(
                                                            (t) =>
                                                                t.id.toString() ===
                                                                formData.treatment,
                                                        )?.name) ||
                                                        'Seleccionar servicio'}
                                                </SelectTrigger>
                                                <SelectContent
                                                    className='select-content-admin-edit'
                                                    backgroundColor='white'
                                                >
                                                    {treatments &&
                                                        treatments.map(
                                                            ({ id, name }) => (
                                                                <SelectItem
                                                                    cursor='pointer'
                                                                    _hover={{
                                                                        backgroundColor:
                                                                            'gray.100',
                                                                    }}
                                                                    backgroundColor='white'
                                                                    item={name}
                                                                    key={id}
                                                                    p={2}
                                                                    data-state={
                                                                        id ===
                                                                        id
                                                                            ? 'checked'
                                                                            : 'unchecked'
                                                                    }
                                                                >
                                                                    {name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                </SelectContent>
                                            </SelectRoot>
                                        )}
                                    </Box>

                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Fecha
                                            </Field.Label>
                                            <Input
                                                _dark={{
                                                    '&::-webkit-calendar-picker-indicator':
                                                        {
                                                            filter: 'invert(1)',
                                                        },
                                                }}
                                                p={2}
                                                type='date'
                                                name='date'
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>

                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Hora
                                            </Field.Label>
                                            <Input
                                                _dark={{
                                                    '&::-webkit-calendar-picker-indicator':
                                                        {
                                                            filter: 'invert(1)',
                                                        },
                                                }}
                                                p={2}
                                                type='time'
                                                name='time'
                                                value={formData.time}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>
                                </form>
                            ) : (
                                <Text>
                                    ¿Estás seguro que deseas cancelar esta cita?
                                </Text>
                            )}
                        </Dialog.Body>

                        <Dialog.Footer p={4}>
                            <Button
                                backgroundColor={
                                    mode === 'cancel' ? 'black' : 'red'
                                }
                                color='white'
                                p={3}
                                onClick={onClose}
                            >
                                {mode === 'cancel' ? 'Volver' : 'Cancelar'}
                            </Button>

                            <Button
                                colorScheme={mode === 'cancel' ? 'red' : 'blue'}
                                ml={3}
                                onClick={
                                    mode === 'cancel'
                                        ? handleCancelAppointment
                                        : handleSubmit
                                }
                                p={3}
                                backgroundColor={
                                    mode === 'cancel' ? 'red' : '#1C4ED8'
                                }
                                color='white'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner size='sm' mr={2} />
                                ) : mode === 'cancel' ? (
                                    'Confirmar cancelación'
                                ) : mode === 'edit' ? (
                                    'Actualizar'
                                ) : (
                                    'Guardar'
                                )}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

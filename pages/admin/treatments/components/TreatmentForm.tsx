import ErrorMessage from '@/components/ErrorMessage';
import { Treatment } from '@/interfaces/treatment/Treatment';
import { validateTreatmentFields } from '@/utils/treatments/treatmentValidation';
import { Box, Button, Field, Input } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface TreatmentFormProps {
    initialData?: Omit<Treatment, 'id'>;
    onSubmit: (data: Omit<Treatment, 'id'>) => Promise<void>;
    isSubmitting: boolean;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

export default function TreatmentForm({
    initialData,
    onSubmit,
    isSubmitting,
    onCancel,
    mode,
}: TreatmentFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize form with initial data
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                duration: 0,
            });
        }
    }, [initialData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Field validation
        const fieldErrors = validateTreatmentFields(formData);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Nombre</Field.Label>
                    <Input
                        p={2}
                        name='name'
                        placeholder='Nombre del tratamiento'
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <ErrorMessage message={errors.name} />
                </Field.Root>
            </Box>
            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Descripción</Field.Label>
                    <Input
                        p={2}
                        name='description'
                        placeholder='Descripción'
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <ErrorMessage message={errors.description} />
                </Field.Root>
            </Box>
            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Precio</Field.Label>
                    <Input
                        type='number'
                        p={2}
                        name='price'
                        placeholder='Precio'
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                    <ErrorMessage message={errors.price} />
                </Field.Root>
            </Box>
            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Duración</Field.Label>
                    <Input
                        type='number'
                        p={2}
                        name='duration'
                        placeholder='Duración'
                        value={formData.duration}
                        onChange={handleInputChange}
                    />
                    <ErrorMessage message={errors.duration} />
                </Field.Root>
            </Box>
            <Box display='flex' justifyContent='flex-end' gap={3} mt={6}>
                <Button
                    backgroundColor='gray.200'
                    p={3}
                    color='black'
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    backgroundColor='#1C4ED8'
                    p={3}
                    color='white'
                    type='submit'
                    loading={isSubmitting}
                >
                    {mode === 'create' ? 'Crear' : 'Actualizar'}
                </Button>
            </Box>
        </form>
    );
}

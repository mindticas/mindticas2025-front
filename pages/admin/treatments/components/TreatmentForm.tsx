import ErrorMessage from '@/components/ErrorMessage';
import { Box, Field, Input } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

interface TreatmentFormProps {
    formData: {
        name: string;
        description: string;
        price: number;
        duration: number;
    };
    errors: Record<string, string>;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function TreatmentForm({
    formData,
    errors,
    onInputChange,
}: TreatmentFormProps) {
    return (
        <form>
            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Nombre</Field.Label>
                    <Input
                        p={2}
                        name='name'
                        placeholder='Nombre del tratamiento'
                        value={formData.name}
                        onChange={onInputChange}
                        required
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
                        onChange={onInputChange}
                        required
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
                        onChange={onInputChange}
                        required
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
                        onChange={onInputChange}
                        required
                    />
                    <ErrorMessage message={errors.duration} />
                </Field.Root>
            </Box>
        </form>
    );
}

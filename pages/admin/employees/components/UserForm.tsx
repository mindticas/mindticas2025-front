import React, { useState } from 'react';
import { Box, Field, Input, Button } from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';

interface UserFormProps {
    isLoading: boolean;
    error?: string | null;
    onSubmit: (formData: {
        name: string;
        email: string;
        phone: string;
        password: string;
    }) => void;
    initialValues?: {
        name: string;
        email: string;
        phone: string;
        password: string;
    };
}

export default function UserForm({
    isLoading,
    error,
    onSubmit,
    initialValues = {
        name: '',
        email: '',
        phone: '',
        password: '',
    },
}: UserFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialValues);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Nombre</Field.Label>
                    <Input
                        p={2}
                        name='name'
                        placeholder='Nombre del empleado'
                        onChange={handleInputChange}
                        value={formData.name}
                        required
                    />
                </Field.Root>
            </Box>

            {error && (
                <Box mb={4} color='red' textAlign='center' p={2}>
                    {error}
                </Box>
            )}

            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Email</Field.Label>
                    <Input
                        p={2}
                        type='email'
                        name='email'
                        onChange={handleInputChange}
                        value={formData.email}
                        required
                    />
                </Field.Root>
            </Box>

            <Box mb={4}>
                <Field.Root>
                    <Field.Label fontWeight='semibold'>Teléfono</Field.Label>
                    <Input
                        p={2}
                        type='text'
                        name='phone'
                        onChange={handleInputChange}
                        value={formData.phone}
                        required
                    />
                </Field.Root>
            </Box>

            <Box mb={4}>
                <Field.Root position='relative'>
                    <Field.Label fontWeight='semibold'>Contraseña</Field.Label>
                    <Input
                        p={2}
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        onChange={handleInputChange}
                        value={formData.password}
                        required
                    />
                    <Button
                        position='absolute'
                        right='2'
                        top='7'
                        size='sm'
                        variant='ghost'
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                        }
                    >
                        {showPassword ? (
                            <Eye size={18} />
                        ) : (
                            <EyeOff size={18} />
                        )}
                    </Button>
                </Field.Root>
            </Box>

            <Box mt={6}>
                <Button
                    width='100%'
                    colorPalette='blue'
                    type='submit'
                    loading={isLoading}
                    loadingText='Guardando...'
                >
                    Guardar
                </Button>
            </Box>
        </form>
    );
}

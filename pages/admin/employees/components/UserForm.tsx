import React, { useState } from 'react';
import {
    Box,
    Field,
    Input,
    Button,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { createListCollection } from '@chakra-ui/react';
import { Role } from '@/interfaces/role/Role';

interface UserFormProps {
    roles: Role[];
    isLoading: boolean;
    error?: string | null;
    onSubmit: (formData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        role: string;
    }) => void;
    initialValues?: {
        name: string;
        email: string;
        phone: string;
        password: string;
        role: string;
    };
}

export default function UserForm({
    roles,
    isLoading,
    error,
    onSubmit,
    initialValues = {
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
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
                <SelectRoot
                    name='role'
                    collection={createListCollection({
                        items: Array.isArray(roles) ? roles : [],
                    })}
                    onValueChange={(e) => {
                        const selectedRole = roles.find(
                            (role) => role.name === e.value.toString(),
                        );
                        setFormData({
                            ...formData,
                            role: selectedRole
                                ? selectedRole.id.toString()
                                : '',
                        });
                    }}
                    required
                >
                    <SelectLabel fontWeight='semibold'>
                        Rol del empleado
                    </SelectLabel>
                    <SelectTrigger>
                        {(roles &&
                            roles.find((t) => t.id.toString() === formData.role)
                                ?.name) ||
                            'Seleccionar rol'}
                    </SelectTrigger>
                    <SelectContent backgroundColor='white'>
                        {roles &&
                            roles.map(({ id, name }) => (
                                <SelectItem
                                    key={id}
                                    cursor='pointer'
                                    _hover={{ backgroundColor: 'gray.100' }}
                                    backgroundColor='white'
                                    item={name}
                                    p={2}
                                >
                                    {name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </SelectRoot>
            </Box>

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
                    Crear empleado
                </Button>
            </Box>
        </form>
    );
}

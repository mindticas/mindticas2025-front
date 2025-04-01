import {
    Box,
    Button,
    Field,
    Heading,
    Input,
    Stack,
    VStack,
    InputAddon,
    Alert,
    Spinner,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState, FormEvent, useEffect } from 'react';
import { InputGroup } from './ui/input-group';
import type { LoginCredentials } from '@/interfaces/login/LoginCredentials';
import { useRouter } from 'next/router';
import { loginUser } from '@/services/authService';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginCredentials>({
        name: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // State for loading state
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.name || !formData.password) {
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }
        setIsLoading(true);
        try {
            const response = await loginUser(formData);
            // If response have a token, is saved in Cookies and redirect to admin
            if (response.token) {
                router.push('/admin');
            }
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            setErrorMessage(error.message || 'Error en la autenticación');
        }
    };
    // Clear the error Message when the user write again
    useEffect(() => {
        if (errorMessage) setErrorMessage(null);
    }, [formData.name, formData.password]);

    return (
        <Box
            w='100vw'
            h='100vh'
            bg='white'
            display='flex'
            justifyContent='center'
            alignItems='center'
            p={4}
        >
            <Box
                bg='white'
                p={[4, 8]}
                borderRadius='md'
                boxShadow='lg'
                w={{ base: '90%', md: '400px', lg: '400px' }}
            >
                <form onSubmit={handleSubmit}>
                    <VStack gap='6'>
                        <Heading as='h1' size='xl' mb={3}>
                            Iniciar sesión
                        </Heading>

                        {errorMessage && (
                            <Stack gap='4' alignItems='center'>
                                <Alert.Root
                                    bg='red.600'
                                    color='white'
                                    font='lg'
                                    borderRadius='md'
                                    fontSize='md'
                                >
                                    <Alert.Title m='3'>
                                        {errorMessage}
                                    </Alert.Title>
                                </Alert.Root>
                            </Stack>
                        )}
                        <Stack gap='6' w='full'>
                            <Field.Root>
                                <Field.Label fontSize='md' mb='1'>
                                    Usuario
                                </Field.Label>
                                <Input
                                    required
                                    name='name'
                                    px={4}
                                    py={6}
                                    size='md'
                                    placeholder='Ingresa tu usuario'
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize='md' mb='1'>
                                    Contraseña
                                </Field.Label>
                                <InputGroup w='full' position='relative'>
                                    <>
                                        <Input
                                            required
                                            name='password'
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            px={4}
                                            py={6}
                                            size='md'
                                            placeholder='Ingresa tu contraseña'
                                            pr='40px'
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <InputAddon
                                            position='absolute'
                                            right='10px'
                                            top='50%'
                                            transform='translateY(-50%)'
                                            zIndex={2}
                                            background='transparent'
                                            border='none'
                                            cursor='pointer'
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </InputAddon>
                                    </>
                                </InputGroup>
                            </Field.Root>
                            <Button
                                type='submit'
                                bg='black'
                                color='white'
                                _hover={{ bg: 'gray.800' }}
                                w='full'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner size='sm' mr={2} />
                                ) : (
                                    'Enviar'
                                )}
                            </Button>
                        </Stack>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
}

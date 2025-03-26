import {
    Box,
    Button,
    Field,
    Heading,
    Input,
    Stack,
    VStack,
    InputAddon,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { InputGroup } from './ui/input-group';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                w={['90%', '100%', '400px']}
            >
                <form>
                    <VStack gap='6'>
                        <Heading as='h1' size='xl' textAlign='center' mb={5}>
                            Iniciar sesión
                        </Heading>
                        <Stack gap='6' w='full'>
                            <Field.Root>
                                <Field.Label fontSize='md' mb='1'>
                                    Usuario
                                </Field.Label>
                                <Input
                                    name='username'
                                    px={4}
                                    py={6}
                                    size='md'
                                    placeholder='Ingresa tu usuario'
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize='md' mb='1'>
                                    Contraseña
                                </Field.Label>
                                <InputGroup w='full' position='relative'>
                                    <>
                                        <Input
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
                            >
                                Enviar
                            </Button>
                        </Stack>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
}

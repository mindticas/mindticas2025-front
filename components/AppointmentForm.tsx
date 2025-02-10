'use client';
import {
    Alert,
    Button,
    Fieldset,
    Flex,
    Input,
    Spinner,
    Stack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import React, { useState } from 'react';

import PhoneInput, { Value } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function AppointmentForm() {
    // State to store form values
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        phone: '',
    });

    // State for form messages
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | '';
    }>({
        type: '',
    });

    // state for loading state
    const [isLoading, setIsLoading] = useState(false);
    // State for phone number validation
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    // Handle phone number change
    const handlePhoneChange = (phone: Value) => {
        setFormData((prev) => ({
            ...prev,
            phone: phone || '',
        }));

        // Validate phone number
        if (phone) {
            setIsPhoneValid(isValidPhoneNumber(phone));
        } else {
            setIsPhoneValid(true); // Reset validation if empty
        }

        // Clear alert when user modifies input
        setAlert({ type: '' });
    };

    // Handle input changes and update state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear alert when user modifies input
        setAlert({ type: '' });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Validate phone number before submission
        if (!isValidPhoneNumber(formData.phone)) {
            setAlert({
                type: 'error',
            });
            return;
        }

        // Set loading state spinner
        setIsLoading(true);

        // Simulate API call (2s delay)
        setTimeout(() => {
            setIsLoading(false);
            const isSuccessful = Math.random() > 0.3; // 70% success rate

            if (isSuccessful) {
                setAlert({
                    type: 'success',
                });
                setFormData({ name: '', lastname: '', phone: '' });
                setIsPhoneValid(true);
            } else {
                setAlert({
                    type: 'error',
                });
            }
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex p='4' justify='center'>
                <Fieldset.Root size='lg' maxW='md'>
                    <Stack>
                        <Fieldset.Legend>Datos del contacto </Fieldset.Legend>
                        <Fieldset.HelperText pb={3}>
                            Ingrese los datos del contacto para agendar una cita
                        </Fieldset.HelperText>
                    </Stack>
                    <Fieldset.Content>
                        <Field required label='Nombre'>
                            <Input
                                size='lg'
                                p={1}
                                type='text'
                                name='name'
                                placeholder='Juan'
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Field>
                        <Field required label='Apellido'>
                            <Input
                                size='lg'
                                p={1}
                                name='lastname'
                                type='text'
                                placeholder='Torres'
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </Field>
                        <Field required label='Número de teléfono'>
                            <PhoneInput
                                international
                                defaultCountry='MX'
                                placeholder='Ingresa tu número de teléfono'
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                style={{
                                    padding: '8px',
                                    fontSize: '16px',
                                    border: isPhoneValid
                                        ? '1px solid #ccc'
                                        : '1px solid red',
                                    borderRadius: '4px',
                                    width: '100%',
                                }}
                            />
                            {!isPhoneValid && (
                                <p style={{ color: 'red', fontSize: '14px' }}>
                                    Número de teléfono inválido.
                                </p>
                            )}
                        </Field>
                    </Fieldset.Content>
                    <Button type='submit' w='full' mt={6} disabled={isLoading}>
                        {isLoading ? <Spinner size='sm' mr={2} /> : 'Agendar'}
                    </Button>
                    {alert.type && (
                        <Alert.Root
                            p={3}
                            status={alert.type}
                            mt={4}
                            borderRadius='md'
                        >
                            <Alert.Indicator />
                            <Stack>
                                <Alert.Title>
                                    {alert.type === 'error'
                                        ? 'Ocurrió un error al agendar la cita, revisa los datos e intenta de nuevo'
                                        : 'Cita reservada con éxito, se enviará un mensaje de confirmación por WhatsApp'}
                                </Alert.Title>
                            </Stack>
                        </Alert.Root>
                    )}
                </Fieldset.Root>
            </Flex>
        </form>
    );
}

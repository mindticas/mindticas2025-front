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
import React, { useEffect, useState } from 'react';

import PhoneInput, { Value } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useBookingContext } from '@/context/BookingContext';

export default function AppointmentForm() {
    const { service, personData, dateTime } = useBookingContext();

    const sendData = async () => {
        const data = {
            name: `${personData.name} ${personData.lastName}`,
            phone: personData.phone,
            service,
            dateTime,
        };
        return data;
    };

    // Global state
    const { setPersonData } = useBookingContext();

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

                setPersonData({
                    name: formData.name,
                    lastName: formData.lastname,
                    phone: formData.phone,
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

    useEffect(() => {
        if (personData.name && personData.lastName && personData.phone) {
            sendData();
        }
    }, [personData]);

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Flex p='6' justify='center'>
                <Fieldset.Root
                    borderRadius='lg'
                    boxShadow='md'
                    borderWidth='1px'
                    borderColor='gray.200'
                    size='lg'
                    maxW='sm'
                    p={6}
                >
                    <Stack>
                        <Fieldset.Legend
                            fontSize='lg'
                            fontWeight='600'
                            color='gray.900'
                        >
                            Datos del contacto
                        </Fieldset.Legend>
                        <Fieldset.HelperText color='gray.600' pb={3}>
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
                                className='PhoneInputInput'
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
                    <Button
                        bg='black'
                        color='white'
                        type='submit'
                        w='full'
                        mt={6}
                        disabled={isLoading}
                    >
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

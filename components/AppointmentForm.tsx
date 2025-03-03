'use client';
import {
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
import { useBookingContext } from '@/context/BookingContext';
import { toaster } from './ui/toaster';
import { createAppointment } from '@/services/AppointmentService';

interface AppointmentFormProps {
    onSuccess: () => void;
    onError: () => void;
}

export default function AppointmentForm({
    onSuccess,
    onError,
}: AppointmentFormProps) {
    const {
        treatment,
        personData,
        setPersonData,
        dateTime,
        setIsSuccessfullyBooked,
    } = useBookingContext();

    // State for loading state
    const [isLoading, setIsLoading] = useState(false);
    // State for phone number validation
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    // Handle phone number change
    const handlePhoneChange = (phone: Value) => {
        setPersonData({
            ...personData,
            phone: phone ? phone.toString() : '',
        });

        // Validate phone number
        if (phone) {
            setIsPhoneValid(isValidPhoneNumber(phone));
        } else {
            setIsPhoneValid(true); // Reset validation if empty
        }
    };

    // Handle input changes and update state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonData({ ...personData, [name]: value });
    };

    // Function to remove country code (+52) and keep only 10 digits
    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('+52')) {
            return phone.slice(3); // Remove +52
        }
        return phone; // If no country code, return as is
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone number before submission
        if (!personData.phone || !isValidPhoneNumber(personData.phone)) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Número de teléfono inválido o vacío',
            });
            return;
        }

        // Validate form fields before submission
        if (!personData.name || !personData.lastName) {
            onError();
            return;
        }

        // Set loading state spinner
        setIsLoading(true);

        try {
            // Format phone number to remove country code
            const formattedPhone = formatPhoneNumber(personData.phone);
            // Create object with appointment data
            const newAppointment = {
                name: `${personData.name} ${personData.lastName}`,
                phone: formattedPhone,
                treatment_ids: [treatment],
                scheduledStart: dateTime,
            };

            // create appointment in the backend
            await createAppointment(newAppointment);

            // if appointment is created successfully, show success message
            setIsLoading(false);
            onSuccess();
            setIsSuccessfullyBooked(true);
            setPersonData({ name: '', lastName: '', phone: '' });
        } catch (error) {
            setIsLoading(false);
            onError();
        }
    };

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
                                value={personData.name}
                                onChange={handleChange}
                            />
                        </Field>
                        <Field required label='Apellido'>
                            <Input
                                size='lg'
                                p={1}
                                name='lastName'
                                type='text'
                                placeholder='Torres'
                                value={personData.lastName}
                                onChange={handleChange}
                            />
                        </Field>
                        <Field required label='Número de teléfono'>
                            <PhoneInput
                                className='PhoneInputInput'
                                countries={['MX']}
                                defaultCountry='MX'
                                placeholder='Ingresa tu número de teléfono'
                                value={personData.phone}
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
                </Fieldset.Root>
            </Flex>
        </form>
    );
}

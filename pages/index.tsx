'use client';

import Head from 'next/head';
import AppointmentForm from '@/components/AppointmentForm';
import Calendar from '@/components/Calendar';
import { Box, Flex, Text } from '@chakra-ui/react';
import ServiceMenu from '@/components/ServiceMenu';
import { useBookingContext } from '@/context/BookingContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster, toaster } from '@/components/ui/toaster';
import { useEffect, useRef } from 'react';

export default function Home() {
    const { service, dateTime } = useBookingContext();
    const formRef = useRef<HTMLDivElement>(null);

    // toast success message
    const handleSuccess = () => {
        toaster.create({
            type: 'success',
            duration: 7000,
            title: 'Cita reservada con éxito, se enviará un mensaje de confirmación por WhatsApp',
        });
    };

    // toast error message
    const handleError = () => {
        toaster.create({
            type: 'error',
            duration: 5000,
            title: 'Ocurrió un error al agendar la cita, revisa los datos e intenta de nuevo',
        });
    };

    // Scroll to form when service and date are selected
    useEffect(() => {
        if (service && dateTime && formRef.current) {
            formRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [service, dateTime]);

    return (
        <>
            <Head>
                <title>Home</title>
                <link rel='icon' href='/favicon.ico' />
                <meta
                    name='description'
                    content='Elegansters barber appointment'
                />
            </Head>
            <Flex direction='column' minHeight='100vh'>
                <Navbar />

                <Box flex={1}>
                    <Text
                        textAlign='center'
                        fontSize='2xl'
                        m={4}
                        fontWeight={600}
                    >
                        RESERVA TU CITA
                    </Text>

                    <Flex
                        gap='5'
                        justifyContent='center'
                        alignItems='center'
                        flexDirection='column'
                    >
                        <ServiceMenu />
                        <Calendar />
                        {dateTime && service && (
                            <div ref={formRef}>
                                <AppointmentForm
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            </div>
                        )}
                        <Toaster />
                    </Flex>
                </Box>

                <Footer />
            </Flex>
        </>
    );
}

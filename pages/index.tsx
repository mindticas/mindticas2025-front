import Head from 'next/head';
import AppointmentForm from '@/components/AppointmentForm';
import Calendar from '@/components/Calendar';
import { Flex, Text } from '@chakra-ui/react';
import ServiceMenu from '@/components/ServiceMenu';
import { useBookingContext } from '@/context/BookingContext';

export default function Home() {
    const { service, personData, dateTime } = useBookingContext();

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
            <Text textAlign='center' fontSize='2xl' m={4}>
                Elegansters barber appointment
            </Text>

            <Flex
                gap='5'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
            >
                <ServiceMenu />
                <Calendar />
                {dateTime && service && <AppointmentForm />}
            </Flex>
        </>
    );
}

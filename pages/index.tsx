import Head from 'next/head';
import AppointmentForm from '@/components/AppointmentForm';
import Calendar from '@/components/Calendar';
import { Flex, Text } from '@chakra-ui/react';

export default function Home() {
    const handleSelectDateTime = (dateTime: Date) => {
        console.log(dateTime);
    };
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
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
            >
                <Calendar onSelectDateTime={handleSelectDateTime} />
                <AppointmentForm />
            </Flex>
        </>
    );
}

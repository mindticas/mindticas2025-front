import Head from 'next/head';
import AppointmentForm from '@/components/AppointmentForm';
import Calendar from '@/components/Calendar';

export default function Home() {
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
            <h1>Elegansters barber appointment</h1>
            <Calendar />
            <AppointmentForm />
        </>
    );
}

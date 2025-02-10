import Head from 'next/head';
import AppointmentForm from '@/components/AppointmentForm';

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

            <AppointmentForm />
        </>
    );
}

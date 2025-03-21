import { Provider } from '@/components/ui/provider';
import { BookingProvider } from '@/context/BookingContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <BookingProvider>
            <Provider>
                <Component {...pageProps} />
            </Provider>
        </BookingProvider>
    );
}

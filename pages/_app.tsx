import { Provider } from '@/components/ui/provider';
import { BookingProvider } from '@/context/BookingContext';
import { BusinessProvider } from '@/context/BusinessContext';
import '@/styles/globals.css';
import { AdminRoute } from '@/utils/AdminRoute';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
    // Acces the current pathname
    const router = useRouter();
    // GetLayout is called by passing the current pathname to obtain the corresponding layout.
    const LayoutAdmin = AdminRoute.getLayout(router.pathname);

    return (
        <BookingProvider>
            <BusinessProvider>
                <Provider>
                    <LayoutAdmin>
                        <Component {...pageProps} />
                    </LayoutAdmin>
                </Provider>
            </BusinessProvider>
        </BookingProvider>
    );
}

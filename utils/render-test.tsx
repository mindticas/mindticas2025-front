import { Provider } from '@/components/ui/provider';
import { BookingProvider } from '@/context/BookingContext';
import { render as rtlRender } from '@testing-library/react';

export function render(ui: React.ReactNode) {
    return rtlRender(<>{ui}</>, {
        wrapper: (props: React.PropsWithChildren) => (
            <Provider>
                <BookingProvider>{props.children}</BookingProvider>
            </Provider>
        ),
    });
}

'use client';

import {
    Toaster as ChakraToaster,
    Portal,
    Spinner,
    Stack,
    Toast,
    createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
    placement: 'bottom-end',
    pauseOnPageIdle: true,
    max: 1,
});

export const Toaster = () => {
    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
                {(toast) => (
                    <Toast.Root p={3} height='max-content' width={{ md: 'md' }}>
                        {toast.type === 'loading' ? (
                            <Spinner size='md' color='blue.solid' />
                        ) : (
                            <Toast.Indicator />
                        )}
                        <Stack gap='1' flex='2' maxWidth='100%'>
                            {toast.title && (
                                <Toast.Title>{toast.title}</Toast.Title>
                            )}
                            {toast.description && (
                                <Toast.Description>
                                    {toast.description}
                                </Toast.Description>
                            )}
                        </Stack>
                        {toast.action && (
                            <Toast.ActionTrigger>
                                {toast.action.label}
                            </Toast.ActionTrigger>
                        )}
                        {toast.meta?.closable && <Toast.CloseTrigger />}
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    );
};

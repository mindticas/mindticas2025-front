import { Dialog, Portal, Button, Text } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
}

export default function DeleteProductModal({
    isOpen,
    onClose,
    productName,
    onConfirm,
    isLoading,
}: DeleteProductModalProps) {
    return (
        <Dialog.Root open={isOpen} placement='center'>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p={5} backgroundColor='white'>
                        <Dialog.Header
                            mb={4}
                            display='flex'
                            justifyContent='space-between'
                            alignContent='center'
                        >
                            <Dialog.Title>Confirmar Eliminación</Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton onClick={onClose} />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                ¿Estás seguro que deseas eliminar el producto "
                                {productName}"?
                            </Text>
                            <Text px={2} mt={2} color='red.500'>
                                Esta acción no se puede deshacer.
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                p={2}
                                variant='subtle'
                                mr={3}
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                p={2}
                                colorPalette='red'
                                onClick={onConfirm}
                                loading={isLoading}
                            >
                                Eliminar
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

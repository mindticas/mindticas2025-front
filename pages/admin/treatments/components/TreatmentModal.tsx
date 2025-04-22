import {
    Box,
    CloseButton,
    Dialog,
    DialogCloseTrigger,
    DialogPositioner,
    Portal,
} from '@chakra-ui/react';

interface TreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TreatmentModal({
    isOpen,
    onClose,
}: TreatmentModalProps) {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={({ open }) => !open && onClose()}
            placement='center'
        >
            <Portal>
                <Dialog.Backdrop />
                <DialogPositioner>
                    <Dialog.Content p={5} backgroundColor='white'>
                        <Dialog.Header
                            mb={4}
                            display='flex'
                            justifyContent='space-between'
                            alignContent='center'
                        >
                            <Dialog.Title>Nuevo treatment</Dialog.Title>
                            <Dialog.CloseTrigger>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Box>Hola, wait a moment</Box>
                        </Dialog.Body>
                    </Dialog.Content>
                </DialogPositioner>
            </Portal>
        </Dialog.Root>
    );
}

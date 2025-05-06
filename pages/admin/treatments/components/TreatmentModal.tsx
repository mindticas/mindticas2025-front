import { Treatment } from '@/interfaces/treatment/Treatment';
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    DialogPositioner,
    Portal,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TreatmentForm from './TreatmentForm';

export type ModalMode = 'create' | 'edit' | 'cancel' | 'delete';
export type TreatmentModalEvent = {
    type: 'create' | 'update' | 'delete' | 'cancel';
    treatment?: Omit<Treatment, 'id'>;
    treatmentId?: string | number;
};

interface TreatmentModalProps {
    onEvent: (e: TreatmentModalEvent) => Promise<void>;
    isSubmitting: boolean;
    trigger?: {
        action: 'open' | 'close';
        mode?: ModalMode;
        treatment?: Treatment;
    };
}

const MODE_TITLES = {
    create: 'Nuevo tratamiento',
    edit: 'Editar tratamiento',
    delete: 'Eliminar tratamiento',
    cancel: 'Tratamiento',
};

export default function TreatmentModal({
    onEvent,
    isSubmitting,
    trigger,
}: TreatmentModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ModalMode>('create');
    const [selectedTreatment, setSelectedTreatment] = useState<
        Treatment | undefined
    >();

    // Update internal state when props change
    useEffect(() => {
        if (!trigger) return;
        if (trigger.action === 'open') {
            setIsOpen(true);
            setMode(trigger.mode ?? 'create');
            setSelectedTreatment(trigger.treatment);
        } else {
            setIsOpen(false);
        }
    }, [trigger]);

    const handleFormSubmit = async (formData: Omit<Treatment, 'id'>) => {
        if (mode === 'create') {
            await onEvent({ type: 'create', treatment: formData });
        } else if (mode === 'edit' && selectedTreatment) {
            await onEvent({
                type: 'update',
                treatment: formData,
                treatmentId: selectedTreatment.id,
            });
        }
        if (!isSubmitting) {
            setIsOpen(false);
        }
    };
    const handleClose = () => {
        setIsOpen(false);
        onEvent({ type: 'cancel' });
    };

    const handleDelete = async () => {
        if (mode === 'delete' && selectedTreatment) {
            await onEvent({
                type: 'delete',
                treatmentId: selectedTreatment.id,
            });
        }
        if (!isSubmitting) {
            setIsOpen(false);
        }
    };
    const getFormInitialData = (
        treatment?: Treatment,
    ): Omit<Treatment, 'id'> | undefined => {
        if (!treatment) return undefined;
        const { id, ...rest } = treatment;
        return rest;
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={({ open }) => !open && handleClose()}
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
                            <Dialog.Title>
                                {MODE_TITLES[mode] ?? 'Tratamiento'}
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            {mode === 'create' || mode === 'edit' ? (
                                <TreatmentForm
                                    initialData={getFormInitialData(
                                        selectedTreatment,
                                    )}
                                    onSubmit={handleFormSubmit}
                                    isSubmitting={isSubmitting}
                                    onCancel={handleClose}
                                    mode={mode}
                                />
                            ) : mode === 'delete' ? (
                                <>
                                    <Text>
                                        ¿Estás seguro que deseas eliminar el
                                        tratamiento "{selectedTreatment?.name}"
                                        Esta acción no se puede deshacer.
                                    </Text>
                                    <Box
                                        display='flex'
                                        justifyContent='flex-end'
                                        gap={3}
                                    >
                                        <Button
                                            backgroundColor='gray.200'
                                            p={3}
                                            color='black'
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            backgroundColor='red'
                                            p={3}
                                            color='white'
                                            onClick={handleDelete}
                                            loading={isSubmitting}
                                        >
                                            Eliminar
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <></>
                            )}
                        </Dialog.Body>
                    </Dialog.Content>
                </DialogPositioner>
            </Portal>
        </Dialog.Root>
    );
}

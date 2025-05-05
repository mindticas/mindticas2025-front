import React, { useState } from 'react';
import { Dialog, Portal, Box, Field, Input, Button } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { toaster } from '@/components/ui/toaster';
import { createRole } from '@/services/RoleService';

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateRoleModal({
    isOpen,
    onClose,
}: CreateRoleModalProps) {
    const [roleName, setRoleName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!roleName.trim()) return;

        setIsLoading(true);
        try {
            await createRole({ name: roleName });
            toaster.create({
                type: 'success',
                duration: 5000,
                title: 'Rol creado correctamente',
            });
            setRoleName('');
            onClose();
        } catch (error) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Error al crear el rol',
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                            alignItems='center'
                        >
                            <Dialog.Title>Crear Nuevo Rol</Dialog.Title>
                            <Dialog.CloseTrigger asChild onClick={onClose}>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Box mb={4}>
                                <Field.Root>
                                    <Field.Label fontWeight='semibold'>
                                        Nombre del Rol
                                    </Field.Label>
                                    <Input
                                        p={2}
                                        value={roleName}
                                        onChange={(e) =>
                                            setRoleName(e.target.value)
                                        }
                                        placeholder='Barbero'
                                        required
                                    />
                                </Field.Root>
                            </Box>
                        </Dialog.Body>

                        <Dialog.Footer p={4}>
                            <Button
                                variant='subtle'
                                p={3}
                                mx={2}
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                p={2}
                                colorPalette='blue'
                                onClick={handleSubmit}
                                loading={isLoading}
                            >
                                Crear Rol
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

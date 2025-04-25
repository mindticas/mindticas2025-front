import React, { useState, useEffect } from 'react';
import { Dialog, Portal } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { getRoles } from '@/services/RoleService';
import { createUser } from '@/services/UserService';
import { toaster } from '@/components/ui/toaster';
import { User } from '@/interfaces/user/User';
import { Role } from '@/interfaces/role/Role';
import UserForm from './UserForm';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: (user: User) => void;
}

export default function CreateUserModal({
    isOpen,
    onClose,
    onUserCreated,
}: CreateUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        const loadRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                setError('Error al cargar los roles');
            }
        };

        loadRoles();
    }, [isOpen]);

    const handleSubmit = async (formData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        role: string;
    }) => {
        setIsLoading(true);

        try {
            const createdUser = await createUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role_id: parseInt(formData.role),
            });

            onUserCreated(createdUser);
            toaster.create({
                type: 'success',
                duration: 5000,
                title: 'Empleado creado correctamente',
            });
            onClose();
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: '',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Error al crear el empleado, revisa que el empleado no exista o intenta más tarde',
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
                            <Dialog.Title>Crear Empleado</Dialog.Title>
                            <Dialog.CloseTrigger asChild onClick={onClose}>
                                <CloseButton color='black' size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body>
                            <UserForm
                                roles={roles}
                                isLoading={isLoading}
                                error={error}
                                onSubmit={handleSubmit}
                            />
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

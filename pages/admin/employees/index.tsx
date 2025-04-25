import React, { useEffect, useState } from 'react';
import AdminTable from '../AdminTable';
import { User } from '@/interfaces/user/User';
import { useFilters } from '@/hooks/useFilters';
import {
    Box,
    Button,
    Dialog,
    Portal,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Eye, Plus, Trash } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { deleteUser, getUsers } from '@/services/UserService';
import { SearchFilters } from '@/components/SearchFilters';
import { CloseButton } from '@/components/ui/close-button';
import { Toaster, toaster } from '@/components/ui/toaster';
import UserDetailModal from './components/UserDetailModal';
import CreateUserModal from './components/CreateUserModal';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const { filters, handleFilterChange, handleSortChange } = useFilters({
        name: '',
        sort: '',
    });
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const isMediumScreen = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUsers(filters.sort);
                setLoading(false);
                setUsers(data);
            } catch (error) {
                setLoading(false);
                setError(
                    'Error al cargar los empleados, por favor intenta más tarde',
                );
            }
        };
        fetchData();
    }, [filters.sort]);

    const filteredCustomers = users.filter((user) => {
        const name = user.name || '';
        const phone = user.phone || '';
        return (
            name.toLowerCase().includes(filters.name.toLowerCase()) ||
            phone.toLowerCase().includes(filters.name.toLowerCase())
        );
    });

    const handleOpenDeleteModal = (id: number) => {
        setUserToDelete(id);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete);

            setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
            toaster.create({
                type: 'success',
                duration: 5000,
                title: 'Empleado eliminado correctamente',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Error al eliminar el empleado',
            });
        } finally {
            handleCloseDeleteModal();
        }
    };

    //     e.preventDefault();
    //     setIsLoadingSubmit(true);
    //     try {
    //         const body: CreateUser = {
    //             name: formData.name,
    //             email: formData.email,
    //             phone: formData.phone,
    //             password: formData.password,
    //             role_id: parseInt(formData.role),
    //         };
    //         const createdUser = await createUser(body);
    //         setUsers((prev) => [...prev, createdUser]);

    //         setIsLoadingSubmit(false);
    //         setFormData({
    //             name: '',
    //             email: '',
    //             phone: '',
    //             password: '',
    //             role: '',
    //         });
    //         toaster.create({
    //             type: 'success',
    //             duration: 5000,
    //             title: 'Empleado creado correctamente',
    //         });
    //     } catch (error) {
    //         setIsLoadingSubmit(false);
    //         toaster.create({
    //             type: 'error',
    //             duration: 5000,
    //             title: 'Error al crear el empleado, revisa que el empleado no exista o intenta más tarde',
    //         });
    //     }
    // };

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    const handleUserCreated = (newUser: User) => {
        setUsers((prev) => [...prev, newUser]);
    };

    const tableColumns = [
        {
            key: 'name',
            header: 'NOMBRE',
            render: (user: User) => user.name || 'Sin nombre',
            align: 'center' as const,
        },
        {
            key: 'phone',
            header: 'TELÉFONO',
            render: (user: User) => user.phone || 'Sin teléfono',
            align: 'center' as const,
        },

        {
            key: 'actions',
            header: 'ACCIONES',
            render: (user: User) => (
                <Box display='flex' gap={2} justifyContent='center'>
                    <Tooltip
                        content='Ver detalle'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => {
                                setSelectedUserId(user.id);
                            }}
                        >
                            <Eye strokeWidth={3} color='Blue' />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Borrar empleado'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => handleOpenDeleteModal(user.id)}
                        >
                            <Trash strokeWidth={3} color='red' />
                        </Button>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box
            className='light'
            borderRadius='lg'
            p={isMediumScreen ? 4 : 8}
            m={isMediumScreen ? 4 : 8}
        >
            <Box
                display='flex'
                justifyContent={'space-between'}
                gap={6}
                mb={4}
                flexDirection={isSmallScreen ? 'column' : 'row'}
            >
                <Text fontSize='2xl' fontWeight='bold' mb={4}>
                    Empleados
                </Text>

                <Button
                    p={2}
                    fontWeight='bold'
                    size='lg'
                    colorPalette='blue'
                    onClick={() => setOpenModalCreate(true)}
                >
                    <Plus size={20} />
                    Crear Empleado
                </Button>
            </Box>

            <div>
                {error && (
                    <p
                        style={{
                            color: 'red',
                            textAlign: 'center',
                            padding: '10px',
                        }}
                    >
                        {error}
                    </p>
                )}
            </div>

            <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                showSort={true}
            />

            <AdminTable
                data={filteredCustomers}
                columns={tableColumns}
                isLoading={loading}
            />

            <UserDetailModal
                userId={selectedUserId}
                isOpen={!!selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />

            <CreateUserModal
                isOpen={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onUserCreated={handleUserCreated}
            />

            {/* modal delete user */}
            <Dialog.Root open={openDeleteModal} placement='center'>
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
                                <Dialog.Title>
                                    Confirmar eliminación de empleado
                                </Dialog.Title>
                                <Dialog.CloseTrigger
                                    asChild
                                    onClick={handleCloseDeleteModal}
                                >
                                    <CloseButton color='black' size='sm' />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body>
                                <Text>
                                    ¿Estás seguro que deseas eliminar este
                                    empleado?
                                </Text>
                                <Text mt={2} px={2} fontWeight='bold'>
                                    Esta acción no se puede deshacer.
                                </Text>
                            </Dialog.Body>

                            <Dialog.Footer p={4}>
                                <Button
                                    variant='subtle'
                                    mr={3}
                                    p={2}
                                    onClick={handleCloseDeleteModal}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    colorPalette='red'
                                    p={2}
                                    onClick={handleDeleteUser}
                                >
                                    Confirmar eliminación
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
            <Toaster />
        </Box>
    );
}

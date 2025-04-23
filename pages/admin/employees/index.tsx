import React, { useEffect, useState } from 'react';
import AdminTable from '../AdminTable';
import { User } from '@/interfaces/user/User';
import { useFilters } from '@/hooks/useFilters';
import {
    Box,
    Button,
    createListCollection,
    DataList,
    Dialog,
    Field,
    Input,
    Portal,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    Spinner,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Calendar, Eye, EyeOff, Plus, Trash } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
} from '@/services/UserService';
import { SearchFilters } from '@/components/SearchFilters';
import { Appointment } from '@/interfaces/appointment/Appointment';
import { CloseButton } from '@/components/ui/close-button';
import StatusBadge from '../appointments/components/ui/StatusBadge';
import { DateTime } from 'luxon';
import { getRoles } from '@/services/RoleService';
import { Role } from '@/interfaces/role/Role';
import { CreateUser } from '@/interfaces/user/CreateUser';
import { Toaster, toaster } from '@/components/ui/toaster';
import UserDetailModal from '../clients/components/UserDetailModal';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorRoles, setErrorRoles] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [appointmentsByUser, setAppointmentsByUser] = useState<Appointment[]>(
        [],
    );
    const { filters, handleFilterChange, handleSortChange } = useFilters({
        name: '',
        sort: '',
    });
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const isMediumScreen = useBreakpointValue({ base: true, md: false });
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
    });

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

    // const handleOpenUserModal = async (id: number) => {
    //     const user = await getUserById(id);
    //     setAppointmentsByUser(user.appointments);

    //     const selecteduser = users.find((user) => user.id === id);
    //     if (selecteduser) {
    //         setSelectUser(selecteduser);
    //         setOpenModal(true);
    //     }
    // };

    const handleCreateOpenModal = async () => {
        try {
            const rolesData = await getRoles();
            setRoles(rolesData);
        } catch (error) {
            setErrorRoles(
                'Error al cargar los roles, por favor intenta más tarde',
            );
        }
        setOpenModalCreate(true);
    };

    const handleCreateCloseModal = () => {
        setOpenModalCreate(false);
    };

    // const handleCloseClientModal = () => {
    //     setOpenModal(false);
    //     setSelectUser(null);
    // };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingSubmit(true);
        try {
            const body: CreateUser = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role_id: parseInt(formData.role),
            };
            const createdUser = await createUser(body);
            setUsers((prev) => [...prev, createdUser]);

            setIsLoadingSubmit(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: '',
            });
            toaster.create({
                type: 'success',
                duration: 5000,
                title: 'Empleado creado correctamente',
            });
        } catch (error) {
            setIsLoadingSubmit(false);
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Error al crear el empleado, revisa que el empleado no exista o intenta más tarde',
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
                    onClick={handleCreateOpenModal}
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

            {/* modal user detail */}
            {/* <Dialog.Root
                scrollBehavior='inside'
                open={openModal}
                placement={'center'}
            >
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
                                <Dialog.Title display='flex' gap={1} px={2}>
                                    <Calendar color='blue' strokeWidth={2} />
                                    Historial de citas - {selectUser?.name}
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton
                                        size='sm'
                                        color='black'
                                        onClick={handleCloseClientModal}
                                    />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body pb='8'>
                                <DataList.Root orientation='horizontal' p={2}>
                                    {appointmentsByUser.length > 0 ? (
                                        appointmentsByUser.map(
                                            ({
                                                id,
                                                status,
                                                scheduled_start,
                                                treatments,
                                                customer,
                                            }) => (
                                                <Box
                                                    key={id}
                                                    p={2}
                                                    border='1px solid gray'
                                                    borderRadius='md'
                                                    display='flex'
                                                    flexDirection='column'
                                                >
                                                    <DataList.Item
                                                        justifyContent='space-between'
                                                        mb={2}
                                                    >
                                                        <DataList.ItemValue>
                                                            {treatments
                                                                .map(
                                                                    (
                                                                        treatment,
                                                                    ) =>
                                                                        treatment.name,
                                                                )
                                                                .join(', ')}
                                                        </DataList.ItemValue>
                                                        <DataList.ItemValue justifyContent='end'>
                                                            <StatusBadge
                                                                statusValue={
                                                                    status
                                                                }
                                                            />
                                                        </DataList.ItemValue>
                                                    </DataList.Item>

                                                    <DataList.Item mb={2}>
                                                        <DataList.ItemLabel>
                                                            Fecha
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {DateTime.fromISO(
                                                                scheduled_start,
                                                            ).toFormat(
                                                                'dd-MM-yyyy',
                                                            )}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>

                                                    <DataList.Item mb={2}>
                                                        <DataList.ItemLabel>
                                                            Hora
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {DateTime.fromISO(
                                                                scheduled_start,
                                                            ).toFormat('HH:mm')}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>

                                                    <DataList.Item>
                                                        <DataList.ItemLabel>
                                                            Cliente
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {customer?.name ||
                                                                'Sin cliente'}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                </Box>
                                            ),
                                        )
                                    ) : (
                                        <Box
                                            width='100%'
                                            textAlign='center'
                                            p={4}
                                            color='gray.500'
                                        >
                                            <Text fontSize='lg'>
                                                Aún no ha hecho citas
                                            </Text>
                                        </Box>
                                    )}
                                </DataList.Root>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root> */}
            <UserDetailModal
                userId={selectedUserId}
                isOpen={!!selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />

            {/* create modal */}
            <Dialog.Root open={openModalCreate} placement='center'>
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
                                <Dialog.Title>Crear Empleado</Dialog.Title>
                                <Dialog.CloseTrigger
                                    asChild
                                    onClick={handleCreateCloseModal}
                                >
                                    <CloseButton color='black' size='sm' />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body>
                                <form onSubmit={handleSubmit}>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Nombre
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                name='name'
                                                placeholder='Nombre del empleado'
                                                onChange={handleInputChange}
                                                value={formData.name}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>

                                    <Box mb={4}>
                                        <div>
                                            {errorRoles && (
                                                <p
                                                    style={{
                                                        color: 'red',
                                                        textAlign: 'center',
                                                        padding: '10px',
                                                    }}
                                                >
                                                    {errorRoles}
                                                </p>
                                            )}
                                        </div>

                                        {roles && (
                                            <SelectRoot
                                                name='treatment'
                                                collection={createListCollection(
                                                    {
                                                        items: roles,
                                                    },
                                                )}
                                                onValueChange={(e) => {
                                                    const selectedRole =
                                                        roles.find(
                                                            (role) =>
                                                                role.name ===
                                                                e.value.toString(),
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        role: selectedRole
                                                            ? selectedRole.id.toString()
                                                            : '',
                                                    });
                                                }}
                                                required
                                            >
                                                <SelectLabel fontWeight='semibold'>
                                                    Rol del empleado
                                                </SelectLabel>
                                                <SelectTrigger>
                                                    {(roles &&
                                                        roles.find(
                                                            (t) =>
                                                                t.id.toString() ===
                                                                formData.role,
                                                        )?.name) ||
                                                        'Seleccionar servicio'}
                                                </SelectTrigger>
                                                <SelectContent backgroundColor='white'>
                                                    {roles &&
                                                        roles.map(
                                                            ({ id, name }) => (
                                                                <SelectItem
                                                                    cursor='pointer'
                                                                    _hover={{
                                                                        backgroundColor:
                                                                            'gray.100',
                                                                    }}
                                                                    backgroundColor='white'
                                                                    item={name}
                                                                    key={id}
                                                                    p={2}
                                                                    data-state={
                                                                        id ===
                                                                        id
                                                                            ? 'checked'
                                                                            : 'unchecked'
                                                                    }
                                                                >
                                                                    {name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                </SelectContent>
                                            </SelectRoot>
                                        )}
                                    </Box>

                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Email
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                type='email'
                                                name='email'
                                                onChange={handleInputChange}
                                                value={formData.email}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>

                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Teléfono
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                type='text'
                                                name='phone'
                                                onChange={handleInputChange}
                                                value={formData.phone}
                                                required
                                            />
                                        </Field.Root>
                                    </Box>
                                    <Box mb={4}>
                                        <Field.Root>
                                            <Field.Label fontWeight='semibold'>
                                                Contraseña
                                            </Field.Label>
                                            <Input
                                                p={2}
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name='password'
                                                onChange={handleInputChange}
                                                value={formData.password}
                                                required
                                            />
                                            <Button
                                                position='absolute'
                                                right='2'
                                                top='7'
                                                size='sm'
                                                variant='solid'
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? 'Ocultar contraseña'
                                                        : 'Mostrar contraseña'
                                                }
                                            >
                                                {showPassword ? (
                                                    <Eye size={18} />
                                                ) : (
                                                    <EyeOff size={18} />
                                                )}
                                            </Button>
                                        </Field.Root>
                                    </Box>
                                </form>
                            </Dialog.Body>

                            <Dialog.Footer p={4}>
                                <Button
                                    colorPalette='blue'
                                    ml={3}
                                    onClick={handleSubmit}
                                    p={3}
                                    backgroundColor='#1C4ED8'
                                    color='white'
                                    disabled={isLoadingSubmit}
                                >
                                    {isLoadingSubmit ? (
                                        <Spinner size='sm' mr={2} />
                                    ) : (
                                        'Guardar'
                                    )}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

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

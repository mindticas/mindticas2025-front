import React from 'react';

import { useState, useMemo, useEffect } from 'react';
import {
    CalendarCheck,
    CircleCheckBig,
    CircleX,
    Clock,
    FilePenLine,
    Plus,
} from 'lucide-react';
import {
    Box,
    Button,
    Input,
    Grid,
    Dialog,
    Portal,
    CloseButton,
    SelectRoot,
    createListCollection,
    Table,
    useBreakpointValue,
    Text,
    Badge,
    Field,
    Spinner,
} from '@chakra-ui/react';
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
import { useRouter } from 'next/router';

const initialAppointments = [
    {
        id: 1,
        name: 'John Doe',
        service: 'Haircut',
        date: '2023-05-15',
        time: '14:00',
        status: 'pending',
    },
    {
        id: 2,
        name: 'Jane Smith',
        service: 'Beard Trim',
        date: '2023-05-16',
        time: '10:30',
        status: 'confirmed',
    },
    {
        id: 3,
        name: 'Jane Smith',
        service: 'Beard Trim',
        date: '2023-05-16',
        time: '10:30',
        status: 'cancelled',
    },
    {
        id: 4,
        name: 'Jane Smith',
        service: 'Beard Trim',
        date: '2023-05-16',
        time: '10:30',
        status: 'completed',
    },
];

const services = [
    { value: 'Haircut', label: 'Haircut' },
    { value: 'Beard Trim', label: 'Beard Trim' },
    { value: 'Hair Coloring', label: 'Hair Coloring' },
];

const statusOptions = [
    {
        value: 'confirmed',
        label: 'Confirmado',
        color: 'blue',
        icon: <CalendarCheck size={16} />,
    },
    {
        value: 'pending',
        label: 'Pendiente',
        color: 'yellow',
        icon: <Clock size={16} strokeWidth={3} />,
    },
    {
        value: 'cancelled',
        label: 'Cancelado',
        color: 'red',
        icon: <CircleX size={16} strokeWidth={3} />,
    },
    {
        value: 'completed',
        label: 'Completado',
        color: 'green',
        icon: <CircleCheckBig size={16} strokeWidth={3} />,
    },
    { value: '', label: 'Todos los estatus', color: 'gray' },
];

export default function CitasPage() {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [appointments, setAppointments] = useState(initialAppointments);
    const [formData, setFormData] = useState({
        name: '',
        service: '',
        date: '',
        time: '',
        status: 'Pendiente',
    });
    const [filters, setFilters] = useState({
        name: '',
        service: '',
        date: '',
        status: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<
        number | null
    >(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const handleEdit = (id: number) => {
        const appointmentToEdit = appointments.find(
            (appointment) => appointment.id === id,
        );
        if (appointmentToEdit) {
            setFormData(appointmentToEdit);
            setEditingId(id);
            setIsModalOpen(true);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId !== null) {
            setAppointments(
                appointments.map((appointment) =>
                    appointment.id === editingId
                        ? { ...appointment, ...formData }
                        : appointment,
                ),
            );
            setEditingId(null);
        } else {
            const newAppointment = { id: appointments.length + 1, ...formData };
            setAppointments([...appointments, newAppointment]);
        }

        setFormData({
            name: '',
            service: '',
            date: '',
            time: '',
            status: 'pending',
        });
    };

    const filteredAppointments = useMemo(() => {
        return appointments
            .filter((appointment) => {
                return (
                    appointment.name
                        .toLowerCase()
                        .includes(filters.name.toLowerCase()) &&
                    appointment.service
                        .toLowerCase()
                        .includes(filters.service.toLowerCase()) &&
                    appointment.date.includes(filters.date) &&
                    (filters.status === '' ||
                        appointment.status === filters.status)
                );
            })
            .sort((a, b) => {
                // Sort by date and time, latest first
                const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
                const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
                return dateTimeB - dateTimeA;
            });
    }, [appointments, filters]);

    const handleDeleteClick = (id: number) => {
        setAppointmentToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (appointmentToDelete) {
            setAppointments(
                appointments.filter(
                    (appointment) => appointment.id !== appointmentToDelete,
                ),
            );
            setAppointmentToDelete(null);
        }
        setDeleteModalOpen(false);
    };

    return (
        <Box
            p={isSmallScreen ? 3 : 8}
            m={isSmallScreen ? 3 : 8}
            bg='white'
            borderRadius='lg'
            className='light'
        >
            {/* Modals */}
            <Box display='flex' justifyContent='space-between' mb={4}>
                <Box as='h1' fontSize='3xl' fontWeight='bold'>
                    Citas
                </Box>

                {/* Create and edit Modal */}
                <Dialog.Root
                    placement='center'
                    open={isModalOpen}
                    onOpenChange={({ open }) => setIsModalOpen(open)}
                >
                    {/* <Dialog.Trigger asChild>
                        <Button
                            fontWeight='700'
                            p={4}
                            color='white'
                            fontSize='md'
                            backgroundColor='#1C4ED8'
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    service: '',
                                    date: '',
                                    time: '',
                                    status: 'Pendiente',
                                });
                                setEditingId(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus strokeWidth={3} />
                            Nueva Cita
                        </Button>
                    </Dialog.Trigger> */}
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
                                        {editingId !== null
                                            ? 'Editar Cita'
                                            : 'Nueva Cita'}
                                    </Dialog.Title>
                                    <Dialog.CloseTrigger asChild>
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
                                                    placeholder='Nombre del Cliente'
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Field.Root>
                                        </Box>
                                        <Box mb={4}>
                                            <SelectRoot
                                                name='service'
                                                collection={createListCollection(
                                                    { items: services },
                                                )}
                                                onValueChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        service:
                                                            e.value.toString(),
                                                    })
                                                }
                                                required
                                            >
                                                <SelectLabel fontWeight='semibold'>
                                                    Servicio a realizar
                                                </SelectLabel>
                                                <SelectTrigger>
                                                    {formData.service ||
                                                        'Seleccionar servicio'}
                                                </SelectTrigger>
                                                <SelectContent backgroundColor='white'>
                                                    {services.map(
                                                        ({ value, label }) => (
                                                            <SelectItem
                                                                cursor='pointer'
                                                                _hover={{
                                                                    backgroundColor:
                                                                        'gray.100',
                                                                }}
                                                                backgroundColor='white'
                                                                item={value}
                                                                key={label}
                                                                p={2}
                                                                data-state={
                                                                    value ===
                                                                    value
                                                                        ? 'checked'
                                                                        : 'unchecked'
                                                                }
                                                            >
                                                                {label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </SelectRoot>
                                        </Box>
                                        <Box mb={4}>
                                            <Field.Root>
                                                <Field.Label fontWeight='semibold'>
                                                    Fecha
                                                </Field.Label>
                                                <Input
                                                    _dark={{
                                                        '&::-webkit-calendar-picker-indicator':
                                                            {
                                                                filter: 'invert(1)',
                                                            },
                                                    }}
                                                    p={2}
                                                    type='date'
                                                    name='date'
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Field.Root>
                                        </Box>
                                        <Box mb={4}>
                                            <Field.Root>
                                                <Field.Label fontWeight='semibold'>
                                                    Hora
                                                </Field.Label>
                                                <Input
                                                    _dark={{
                                                        '&::-webkit-calendar-picker-indicator':
                                                            {
                                                                filter: 'invert(1)',
                                                            },
                                                    }}
                                                    p={2}
                                                    type='time'
                                                    name='time'
                                                    value={formData.time}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Field.Root>
                                        </Box>
                                    </form>
                                </Dialog.Body>
                                <Dialog.Footer p={4}>
                                    <Dialog.ActionTrigger asChild>
                                        <Button
                                            backgroundColor='red'
                                            color='white'
                                            p={2}
                                        >
                                            Cancelar
                                        </Button>
                                    </Dialog.ActionTrigger>
                                    <Button
                                        colorScheme='blue'
                                        ml={3}
                                        onClick={handleSubmit}
                                        p={2}
                                        backgroundColor='#1C4ED8'
                                        color='white'
                                    >
                                        {editingId !== null
                                            ? 'Actualizar'
                                            : 'Guardar'}
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>

                {/* Delete modal */}
                <Dialog.Root
                    role='alertdialog'
                    open={deleteModalOpen}
                    onOpenChange={(details) => setDeleteModalOpen(details.open)}
                    placement='center'
                >
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content p={5} backgroundColor='white'>
                                <Dialog.Header
                                    display='flex'
                                    justifyContent='space-between'
                                >
                                    <Dialog.Title>
                                        Confirmar cancelación de cita
                                    </Dialog.Title>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton />
                                    </Dialog.CloseTrigger>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Text>
                                        ¿Estás seguro que deseas cancelar esta
                                        cita?
                                    </Text>
                                </Dialog.Body>
                                <Dialog.Footer
                                    p={4}
                                    display='flex'
                                    justifyContent='flex-end'
                                    gap={3}
                                >
                                    <Button
                                        variant='outline'
                                        p={2}
                                        backgroundColor='black'
                                        color='white'
                                        onClick={() =>
                                            setDeleteModalOpen(false)
                                        }
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        p={2}
                                        backgroundColor='red'
                                        color='white'
                                        onClick={confirmDelete}
                                    >
                                        Cancelar cita
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </Box>

            {/* Filters */}
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
                gap={4}
                mb={4}
            >
                <Input
                    p={2}
                    name='name'
                    placeholder='Filtrar por nombre'
                    fontSize='md'
                    value={filters.name}
                    onChange={handleFilterChange}
                />
                <Input
                    p={2}
                    fontSize='md'
                    name='service'
                    placeholder='Filtrar por servicio'
                    value={filters.service}
                    onChange={handleFilterChange}
                />
                <Input
                    p={2}
                    type='date'
                    _dark={{
                        '&::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)',
                        },
                    }}
                    name='date'
                    fontSize='md'
                    value={filters.date}
                    onChange={handleFilterChange}
                />

                <SelectRoot
                    name='status'
                    collection={createListCollection({ items: statusOptions })}
                    onValueChange={(e) =>
                        setFilters({ ...filters, status: e.value.toString() })
                    }
                >
                    <SelectTrigger>
                        {filters.status
                            ? statusOptions.find(
                                  (opt) => opt.value === filters.status,
                              )?.label
                            : 'Filtrar por estado'}
                    </SelectTrigger>
                    <SelectContent backgroundColor='white'>
                        {statusOptions.map(({ value, label }) => (
                            <SelectItem
                                cursor='pointer'
                                _hover={{ backgroundColor: 'gray.100' }}
                                backgroundColor='white'
                                item={value}
                                key={value}
                                p={2}
                            >
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            </Grid>

            {/* Table */}
            <Table.ScrollArea borderWidth='1px' borderRadius='lg'>
                <Table.Root size='sm' variant='outline'>
                    <Table.Header>
                        <Table.Row bg='#F3F4F6' fontWeight='800'>
                            <Table.ColumnHeader textAlign='center'>
                                NOMBRE
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign='center'>
                                TRATAMIENTO
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign='center'>
                                FECHA
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign='center'>
                                HORA
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign='center'>
                                ESTATUS
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign='center'>
                                ACCIONES
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredAppointments.map((appointment) => (
                            <Table.Row
                                className='tr-table'
                                key={appointment.id}
                                borderBottomWidth={1}
                            >
                                <Table.Cell textAlign='center'>
                                    {appointment.name}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {appointment.service}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {appointment.date}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {appointment.time}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    <Badge
                                        colorPalette={
                                            statusOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    appointment.status,
                                            )?.color
                                        }
                                        borderRadius='full'
                                        px={2}
                                        py={1}
                                    >
                                        {(() => {
                                            const { label, icon } =
                                                statusOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        appointment.status,
                                                ) || {};
                                            return (
                                                <>
                                                    {icon}
                                                    {label}
                                                </>
                                            );
                                        })()}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell
                                    p={2}
                                    display='flex'
                                    justifyContent='center'
                                >
                                    <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <Tooltip
                                                showArrow
                                                content='Editar cita'
                                                positioning={{
                                                    placement: 'top',
                                                }}
                                            >
                                                <Button
                                                    backgroundColor='transparent'
                                                    size='md'
                                                    onClick={() =>
                                                        handleEdit(
                                                            appointment.id,
                                                        )
                                                    }
                                                >
                                                    <FilePenLine
                                                        color='blue'
                                                        strokeWidth={3}
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </Dialog.Trigger>
                                    </Dialog.Root>
                                    <Tooltip
                                        showArrow
                                        content='Cancelar cita'
                                        positioning={{
                                            placement: 'top',
                                        }}
                                    >
                                        <Button
                                            size='md'
                                            backgroundColor='transparent'
                                            ml={2}
                                            color='red'
                                            disabled={
                                                appointment.status ===
                                                'cancelled'
                                            }
                                            onClick={() =>
                                                handleDeleteClick(
                                                    appointment.id,
                                                )
                                            }
                                        >
                                            <CircleX strokeWidth={3} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip
                                        showArrow
                                        content='Completar cita'
                                        positioning={{
                                            placement: 'top',
                                        }}
                                    >
                                        <Button
                                            size='md'
                                            backgroundColor='transparent'
                                            color='green'
                                            ml={2}
                                            disabled={
                                                appointment.status ===
                                                'completed'
                                            }
                                        >
                                            <CircleCheckBig strokeWidth={3} />
                                        </Button>
                                    </Tooltip>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    );
}

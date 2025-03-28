'use client';

import type React from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
    CalendarCheck,
    CircleCheckBig,
    CircleX,
    Clock,
    FilePenLine,
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
import {
    getAppointmentById,
    getAppointments,
    updateAppointment,
} from '@/services/AppointmentService';
import { Appointment } from '@/interfaces/appointment/Appointment';
import { getTreatments } from '@/services/TreatmentService';
import { Treatment } from '@/interfaces/treatment/Treatment';
import { splitDateTimeFromISO } from '@/utils/dateUtils';
import { Toaster, toaster } from '@/components/ui/toaster';

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
        value: 'canceled',
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
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        treatment: '',
        date: '',
        time: '',
    });
    const [filters, setFilters] = useState({
        name: '',
        treatments: '',
        date: '',
        status: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setCancelationModalOpen] = useState(false);
    const [appointmentIdToCancel, setappointmentIdToCancel] = useState<
        number | null
    >(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [treatments, setTreatments] = useState<Treatment[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [appointmentsData, treatmentsData] = await Promise.all([
                    getAppointments(),
                    getTreatments(),
                ]);

                setAppointments(appointmentsData);
                setTreatments(treatmentsData);
            } catch (error) {
                setError(
                    'Error al cargar los datos. Inténtalo de nuevo más tarde.',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleEdit = (id: number) => {
        const appointmentToEdit = appointments.find(
            (appointment) => appointment.id === id,
        );

        if (appointmentToEdit) {
            setFormData({
                name: appointmentToEdit.customer?.name || '',
                treatment: appointmentToEdit.treatments
                    .map((treatment) => treatment.id)
                    .join(', '),
                date: splitDateTimeFromISO(appointmentToEdit.scheduled_start)
                    .date,
                time: splitDateTimeFromISO(appointmentToEdit.scheduled_start)
                    .time,
            });
            setEditingId(id);
            setIsModalOpen(true);
        }
    };

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        },
        [],
    );

    const handleFilterChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
        },
        [],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId !== null) {
            try {
                const updatedAppointment = {
                    customer_name: formData.name,
                    treatments_id: [parseInt(formData.treatment)],
                    scheduled_start: `${formData.date}T${formData.time}:00Z`,
                };
                await updateAppointment(editingId, updatedAppointment);
                const verifiedAppointment = await getAppointmentById(editingId);
                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment.id === editingId
                            ? { ...appointment, ...verifiedAppointment }
                            : appointment,
                    ),
                );

                toaster.create({
                    type: 'success',
                    duration: 5000,
                    title: 'Cita actualizada con éxito',
                });
            } catch (error) {
                toaster.create({
                    type: 'error',
                    duration: 5000,
                    title: 'Ocurrió un error al actualizar la cita, intenta de nuevo',
                });
            }

            setEditingId(null);
            setIsModalOpen(false);
        }
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appointment) => {
            return (
                appointment.customer?.name
                    .toLowerCase()
                    .includes(filters.name.toLowerCase()) &&
                appointment.treatments?.some((treatment) =>
                    treatment.name
                        .toLowerCase()
                        .includes(filters.treatments.toLowerCase()),
                ) &&
                appointment.scheduled_start.includes(filters.date) &&
                (filters.status === '' || appointment.status === filters.status)
            );
        });
    }, [appointments, filters]);

    const handleCancelClick = (id: number) => {
        setappointmentIdToCancel(id);
        setCancelationModalOpen(true);
    };

    const confirmCancelation = async () => {
        try {
            if (!appointmentIdToCancel) {
                throw new Error(
                    'Se requiere tratamiento y debe tener una identificación válida.',
                );
            }

            const cancelAppointment = {
                status: 'canceled',
            };
            await updateAppointment(appointmentIdToCancel, cancelAppointment);
            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === appointmentIdToCancel
                        ? { ...a, status: 'canceled' }
                        : a,
                ),
            );

            toaster.create({
                type: 'success',
                duration: 5000,
                title: 'Cita cancelada con éxito',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Ocurrió un error al cancelar la cita, intenta de nuevo',
            });
        }

        setappointmentIdToCancel(null);
        setCancelationModalOpen(false);
    };

    const handleComplete = async (id: number) => {
        try {
            const completedAppointment = {
                status: 'completed',
            };
            await updateAppointment(id, completedAppointment);
            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: 'completed' } : a,
                ),
            );

            toaster.create({
                type: 'success',
                duration: 5000,
                title: 'Cita completada con éxito',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                duration: 5000,
                title: 'Ocurrió un error al completar la cita, intenta de nuevo',
            });
        }
    };

    return (
        <>
            <Box
                p={isSmallScreen ? 3 : 8}
                m={isSmallScreen ? 3 : 8}
                bg='white'
                borderRadius='lg'
                className='light'
            >
                <div>
                    {error && (
                        <p style={{ color: 'red', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}
                </div>

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
                                            <CloseButton
                                                color='black'
                                                size='sm'
                                            />
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
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        required
                                                    />
                                                </Field.Root>
                                            </Box>
                                            <Box mb={4}>
                                                <SelectRoot
                                                    name='treatment'
                                                    collection={createListCollection(
                                                        { items: treatments },
                                                    )}
                                                    onValueChange={(e) => {
                                                        const selectedTreatment =
                                                            treatments.find(
                                                                (treatment) =>
                                                                    treatment.name ===
                                                                    e.value.toString(),
                                                            );
                                                        setFormData({
                                                            ...formData,
                                                            treatment:
                                                                selectedTreatment
                                                                    ? selectedTreatment.id.toString()
                                                                    : '',
                                                        });
                                                    }}
                                                    required
                                                >
                                                    <SelectLabel fontWeight='semibold'>
                                                        Servicio a realizar
                                                    </SelectLabel>
                                                    <SelectTrigger>
                                                        {treatments.find(
                                                            (t) =>
                                                                t.id.toString() ===
                                                                formData.treatment,
                                                        )?.name ||
                                                            'Seleccionar servicio'}
                                                    </SelectTrigger>
                                                    <SelectContent backgroundColor='white'>
                                                        {treatments.map(
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
                                                        onChange={
                                                            handleInputChange
                                                        }
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
                                                        onChange={
                                                            handleInputChange
                                                        }
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
                        onOpenChange={(details) =>
                            setCancelationModalOpen(details.open)
                        }
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
                                            ¿Estás seguro que deseas cancelar
                                            esta cita?
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
                                                setCancelationModalOpen(false)
                                            }
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            p={2}
                                            backgroundColor='red'
                                            color='white'
                                            onClick={confirmCancelation}
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
                        name='treatments'
                        placeholder='Filtrar por servicio'
                        value={filters.treatments}
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
                        collection={createListCollection({
                            items: statusOptions,
                        })}
                        onValueChange={(e) =>
                            setFilters({
                                ...filters,
                                status: e.value.toString(),
                            })
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
                {isLoading ? (
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        height='300px'
                    >
                        <Spinner size='xl' />
                    </Box>
                ) : (
                    <>
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
                                                {appointment.customer?.name ||
                                                    'Sin nombre'}
                                            </Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                {appointment.treatments
                                                    .map(
                                                        (treatment) =>
                                                            treatment.name,
                                                    )
                                                    .join(', ') ||
                                                    'Sin tratamiento'}
                                            </Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                {new Date(
                                                    appointment.scheduled_start,
                                                ).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                {new Date(
                                                    appointment.scheduled_start,
                                                ).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    timeZone: 'UTC',
                                                })}
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
                                                            ) || {
                                                                label: 'Sin estatus',
                                                            };
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
                                                                placement:
                                                                    'top',
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
                                                                    strokeWidth={
                                                                        3
                                                                    }
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
                                                            'canceled'
                                                        }
                                                        onClick={() =>
                                                            handleCancelClick(
                                                                appointment.id,
                                                            )
                                                        }
                                                    >
                                                        <CircleX
                                                            strokeWidth={3}
                                                        />
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
                                                        onClick={() =>
                                                            handleComplete(
                                                                appointment.id,
                                                            )
                                                        }
                                                    >
                                                        <CircleCheckBig
                                                            strokeWidth={3}
                                                        />
                                                    </Button>
                                                </Tooltip>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Table.ScrollArea>
                    </>
                )}
            </Box>
            <Toaster />
        </>
    );
}

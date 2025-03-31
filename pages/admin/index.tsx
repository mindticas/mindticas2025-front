'use client';

import type React from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { CircleCheckBig, CircleX, FilePenLine } from 'lucide-react';
import {
    Box,
    Button,
    Input,
    Dialog,
    Portal,
    CloseButton,
    SelectRoot,
    createListCollection,
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
import { AdminTable } from '@/components/AdminTable';
import { SearchFilters, statusOptions } from '@/components/SearchFilters';
import { useFilters } from '@/hooks/useFilters';
import {
    AppointmentUpdate,
    FormDataType,
} from '@/interfaces/appointment/AppointmentUpdate';

/**
 * The `CitasPage` component is the main page for managing appointments in the admin panel.
 * It provides functionality for viewing, filtering, creating, editing, canceling, and completing appointments.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component for the appointments management page.
 *
 * @description
 * This component includes:
 * - A table displaying a list of appointments with filtering options.
 * - Modals for creating, editing, and canceling appointments.
 * - Functions to handle appointment actions such as editing, canceling, and completing.
 * - State management for appointments, filters, modals, and loading/error states.
 *
 *
 * @remarks
 * - The component uses `useEffect` to fetch initial data for appointments and treatments.
 * - It includes a `useMemo` hook to filter appointments based on user input.
 * - The component relies on external utility functions like `getAppointments`, `getTreatments`, and `updateAppointment`.
 *
 * @state
 * - `isSmallScreen` (`boolean`): Determines if the screen size is small.
 * - `appointments` (`Appointment[]`): List of appointments.
 * - `formData` (`FormDataType`): Form data for creating or editing an appointment.
 * - `filters` (`FiltersType`): Filters applied to the appointments list.
 * - `editingId` (`number | null`): ID of the appointment being edited.
 * - `isModalOpen` (`boolean`): Whether the create/edit modal is open.
 * - `deleteModalOpen` (`boolean`): Whether the cancelation modal is open.
 * - `appointmentIdToCancel` (`number | null`): ID of the appointment to cancel.
 * - `isLoading` (`boolean`): Whether data is being loaded.
 * - `isLoadingSubmit` (`boolean`): Whether a form submission is in progress.
 * - `error` (`string | null`): Error message, if any.
 * - `treatments` (`Treatment[]`): List of available treatments.
 *
 * @functions
 * - `handleEdit(id: number)`: Opens the edit modal for the specified appointment.
 * - `handleInputChange(e: React.ChangeEvent<HTMLInputElement>)`: Updates form data based on user input.
 * - `handleSubmit(e: React.FormEvent)`: Submits the form for creating or editing an appointment.
 * - `getUpdatedFields(formData: FormDataType, originalAppointment: Appointment)`: Determines the fields that have been updated.
 * - `refreshAppointmentState(appointmentId: number)`: Refreshes the state of a specific appointment.
 * - `closeModal()`: Closes the create/edit modal.
 * - `handleUpdateError(error: unknown)`: Handles errors during appointment updates.
 * - `handleCancelClick(id: number)`: Opens the cancelation modal for the specified appointment.
 * - `confirmCancelation()`: Confirms and processes the cancelation of an appointment.
 * - `handleComplete(id: number)`: Marks an appointment as completed.
 *
 * @dependencies
 * - `useBreakpointValue`: Determines screen size.
 * - `useFilters`: Manages filtering logic.
 * - `getAppointments`, `getTreatments`, `updateAppointment`, `getAppointmentById`: API calls for appointments and treatments.
 * - `toaster`: Displays notifications.
 * - `AdminTable`, `SearchFilters`: Custom components for displaying and filtering appointments.
 * - `Dialog`, `Field`, `Input`, `Button`, `Badge`, `Tooltip`: UI components for modals, forms, and actions.
 */
export default function CitasPage() {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [formData, setFormData] = useState<FormDataType>({
        name: '',
        treatment: '',
        date: '',
        time: '',
    });
    const { filters, handleFilterChange, handleStatusChange } = useFilters({
        name: '',
        treatments: '',
        date: '',
        status: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setCancelationModalOpen] = useState(false);
    const [appointmentIdToCancel, setAppointmentIdToCancel] = useState<
        number | null
    >(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId === null) return;

        try {
            setIsLoadingSubmit(true);
            const originalAppointment = await getAppointmentById(editingId);
            const updatedFields = getUpdatedFields(
                formData,
                originalAppointment,
            );

            if (Object.keys(updatedFields).length > 0) {
                await updateAppointment(editingId, updatedFields);
                await refreshAppointmentState(editingId);
                toaster.create({
                    type: 'success',
                    duration: 5000,
                    title: 'Cita actualizada con éxito',
                });
            } else {
                toaster.create({
                    type: 'info',
                    duration: 5000,
                    title: 'No hay cambios para actualizar',
                });
            }
        } catch (error) {
            handleUpdateError(error);
        } finally {
            closeModal();
            setIsLoadingSubmit(false);
        }
    };

    const getUpdatedFields = (
        formData: FormDataType,
        originalAppointment: Appointment,
    ) => {
        const updatedFields: Partial<AppointmentUpdate> = {};

        if (formData.name !== originalAppointment.customer?.name) {
            updatedFields.customer_name = formData.name;
        }

        const originalTreatmentIds = originalAppointment.treatments
            .map((t) => t.id)
            .sort()
            .join(',');
        const newTreatmentIds = formData.treatment
            .split(',')
            .map((id) => parseInt(id.trim()))
            .sort()
            .join(',');

        if (newTreatmentIds !== originalTreatmentIds) {
            updatedFields.treatments_id = formData.treatment
                .split(',')
                .map((id) => parseInt(id.trim()));
        }

        const newScheduledStart = `${formData.date}T${formData.time}:00.000Z`;
        if (newScheduledStart !== originalAppointment.scheduled_start) {
            updatedFields.scheduled_start = newScheduledStart;
        }

        return updatedFields;
    };

    const refreshAppointmentState = async (appointmentId: number) => {
        const verifiedAppointment = await getAppointmentById(appointmentId);
        setAppointments((prev) =>
            prev.map((appointment) =>
                appointment.id === appointmentId
                    ? { ...appointment, ...verifiedAppointment }
                    : appointment,
            ),
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleUpdateError = (error: unknown) => {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Error al actualizar la cita';
        toaster.create({
            type: 'error',
            duration: 5000,
            title: errorMessage,
        });
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
                        .includes(filters.treatments!.toLowerCase()),
                ) &&
                appointment.scheduled_start.includes(filters.date!) &&
                (filters.status === '' || appointment.status === filters.status)
            );
        });
    }, [appointments, filters]);

    const handleCancelClick = (id: number) => {
        setAppointmentIdToCancel(id);
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

        setAppointmentIdToCancel(null);
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

    const tableColumns = [
        {
            key: 'name',
            header: 'NOMBRE',
            render: (appointment: Appointment) =>
                appointment.customer?.name || 'Sin nombre',
            align: 'center' as const,
        },
        {
            key: 'treatment',
            header: 'TRATAMIENTO',
            render: (appointment: Appointment) =>
                appointment.treatments.map((t) => t.name).join(', ') ||
                'Sin tratamiento',
            align: 'center' as const,
        },
        {
            key: 'date',
            header: 'FECHA',
            render: (appointment: Appointment) =>
                new Date(appointment.scheduled_start).toLocaleDateString(
                    'es-ES',
                    {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    },
                ),
            align: 'center' as const,
        },
        {
            key: 'time',
            header: 'HORA',
            render: (appointment: Appointment) =>
                new Date(appointment.scheduled_start).toLocaleTimeString(
                    'es-ES',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                    },
                ),
            align: 'center' as const,
        },
        {
            key: 'status',
            header: 'ESTATUS',
            render: (appointment: Appointment) => {
                const status = statusOptions.find(
                    (opt) => opt.value === appointment.status,
                );
                return (
                    <Badge
                        colorPalette={status?.color}
                        borderRadius='full'
                        px={1}
                        py={1}
                        display='flex'
                        justifyContent='center'
                        gap={1}
                    >
                        {status?.icon}
                        {status?.label}
                    </Badge>
                );
            },
            align: 'center' as const,
        },
        {
            key: 'actions',
            header: 'ACCIONES',
            render: (appointment: Appointment) => (
                <Box display='flex' justifyContent='center'>
                    <Tooltip
                        content='Editar cita'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            size='md'
                            onClick={() => handleEdit(appointment.id)}
                        >
                            <FilePenLine color='blue' strokeWidth={3} />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Cancelar cita'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            size='md'
                            backgroundColor='transparent'
                            ml={2}
                            color='red'
                            disabled={appointment.status === 'canceled'}
                            onClick={() => handleCancelClick(appointment.id)}
                        >
                            <CircleX strokeWidth={3} />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Completar cita'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            size='md'
                            backgroundColor='transparent'
                            color='green'
                            ml={2}
                            disabled={appointment.status === 'completed'}
                            onClick={() => handleComplete(appointment.id)}
                        >
                            <CircleCheckBig strokeWidth={3} />
                        </Button>
                    </Tooltip>
                </Box>
            ),
            align: 'center' as const,
        },
    ];

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
                                            disabled={isLoadingSubmit}
                                        >
                                            {isLoadingSubmit ? (
                                                <Spinner size='sm' mr={2} />
                                            ) : editingId !== null ? (
                                                'Actualizar'
                                            ) : (
                                                'Guardar'
                                            )}
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
                <SearchFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onStatusChange={handleStatusChange}
                    showStatusFilter={true}
                    showDateFilter={true}
                    showTreatmentFilter={true}
                />

                <AdminTable
                    data={filteredAppointments}
                    columns={tableColumns}
                    isLoading={isLoading}
                />
            </Box>
            <Toaster />
        </>
    );
}

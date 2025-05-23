'use client';

import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Box, Text, useBreakpointValue } from '@chakra-ui/react';
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

import { SearchFilters } from '@/components/SearchFilters';
import { useFilters } from '@/hooks/useFilters';
import {
    AppointmentUpdate,
    FormDataType,
} from '@/interfaces/appointment/AppointmentUpdate';
import StatusBadge from './components/StatusBadge';
import AppointmentActions from './components/ActionButtons';
import AppointmentModal from './components/AppointmentModal';

import { DateTime } from 'luxon';
import AdminTable from '../AdminTable';

/**
 * The `CitasPage` component is the main page for managing appointments in the admin panel.
 * It provides functionality for viewing, filtering, editing, canceling, and completing appointments.
 * The page also includes a modal for creating or editing appointments and a table for displaying appointment data.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component for the appointments page.
 *
 */

export default function CitasPage() {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { filters, handleFilterChange, handleStatusChange } = useFilters({
        name: '',
        treatments: '',
        date: '',
        status: '',
    });

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'cancel';
        appointment?: Appointment;
    }>({
        isOpen: false,
        mode: 'create',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [treatments, setTreatments] = useState<Treatment[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [appointmentsData, treatmentsData] = await Promise.all([
                    getAppointments(),
                    getTreatments(),
                ]);
                const adjustedAppointments = appointmentsData.map(
                    (appointment) => {
                        const adjustedScheduledStart = DateTime.fromISO(
                            appointment.scheduled_start,
                            { zone: 'utc' },
                        ).setZone('local');

                        return {
                            ...appointment,
                            scheduled_start: adjustedScheduledStart.toString(),
                        };
                    },
                );
                setAppointments(adjustedAppointments);
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
        const appointment = appointments.find((a) => a.id === id);

        if (appointment) {
            setModalState({
                isOpen: true,
                mode: 'edit',
                appointment,
            });
        }
    };

    const handleConfirm = async (data: {
        id?: number;
        name: string;
        treatment: string;
        date: string;
        time: string;
        tipAmount?: number;
        products?: number[];
    }) => {
        try {
            if (modalState.mode === 'edit' && data.id) {
                const originalAppointment = await getAppointmentById(data.id);
                const adjustedAppointment = {
                    ...originalAppointment,
                    scheduled_start: DateTime.fromISO(
                        originalAppointment.scheduled_start,
                        { zone: 'utc' },
                    )
                        .setZone('local')
                        .toFormat("yyyy-MM-dd'T'HH:mm"),
                };
                const updatedFields = getUpdatedFields(
                    data,
                    adjustedAppointment,
                );

                if (Object.keys(updatedFields).length == 0) {
                    toaster.create({
                        type: 'info',
                        duration: 3000,
                        title: 'No se detectaron cambios para actualizar',
                    });
                    return;
                }

                await updateAppointment(data.id, updatedFields);
                await refreshAppointmentState(data.id);

                toaster.create({
                    type: 'success',
                    duration: 5000,
                    title: 'Cita actualizada con éxito',
                });
            } else if (modalState.mode === 'create') {
                // Logic if you want to create a new appointment in the future for the moment not implemented
            }

            setModalState({ isOpen: false, mode: 'create' });
        } catch (error) {
            handleUpdateError(error);
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

        const newScheduledStart = `${formData.date}T${formData.time}`;

        if (newScheduledStart !== originalAppointment.scheduled_start) {
            const adjustedScheduledStart = DateTime.fromISO(newScheduledStart, {
                zone: 'local',
            })
                .setZone('utc')
                .toFormat("yyyy-MM-dd'T'HH:mm");
            updatedFields.scheduled_start = adjustedScheduledStart;
        }
        if (
            typeof formData.tipAmount !== 'undefined' &&
            Number(formData.tipAmount) !== Number(originalAppointment.tipAmount)
        ) {
            updatedFields.tipAmount = Number(formData.tipAmount);
        }

        if (
            Array.isArray(formData.products) &&
            JSON.stringify(formData.products.sort()) !==
                JSON.stringify(
                    (originalAppointment.products ?? [])
                        .map((p) => p.id)
                        .sort(),
                )
        ) {
            updatedFields.products = formData.products;
        }
        return updatedFields;
    };

    const refreshAppointmentState = async (appointmentId: number) => {
        const verifiedAppointment = await getAppointmentById(appointmentId);

        const adjustedAppointment = {
            ...verifiedAppointment,
            scheduled_start: DateTime.fromISO(
                verifiedAppointment.scheduled_start,
                { zone: 'utc' },
            )
                .setZone('local')
                .toFormat('yyyy/MM/dd, HH:mm'),
        };

        setAppointments((prev) =>
            prev.map((appointment) =>
                appointment.id === appointmentId
                    ? adjustedAppointment
                    : appointment,
            ),
        );
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
        const appointmentToCancel = appointments.find(
            (appointment) => appointment.id === id,
        );
        if (appointmentToCancel) {
            setModalState({
                isOpen: true,
                mode: 'cancel',
                appointment: appointmentToCancel,
            });
        }
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

    const handleCancelConfirm = async (id: number) => {
        try {
            const cancelAppointment = { status: 'canceled' };
            await updateAppointment(id, cancelAppointment);
            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: 'canceled' } : a,
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
                title: 'Error al cancelar la cita',
            });
        } finally {
            setModalState({ isOpen: false, mode: 'create' });
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
                    },
                ),
            align: 'center' as const,
        },
        {
            key: 'status',
            header: 'ESTATUS',
            render: (appointment: Appointment) => (
                <StatusBadge
                    statusValue={appointment.status}
                    key={appointment.id}
                />
            ),
            align: 'center' as const,
        },
        {
            key: 'actions',
            header: 'ACCIONES',
            render: (appointment: Appointment) => (
                <AppointmentActions
                    appointmentId={appointment.id}
                    status={appointment.status}
                    onEdit={handleEdit}
                    onCancel={handleCancelClick}
                    onComplete={handleComplete}
                />
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
                <Text fontSize='2xl' fontWeight='bold' mb={4}>
                    Citas
                </Text>

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

                <AppointmentModal
                    isOpen={modalState.isOpen}
                    onClose={() =>
                        setModalState({ isOpen: false, mode: 'create' })
                    }
                    mode={modalState.mode}
                    treatments={treatments}
                    initialData={
                        modalState.appointment
                            ? {
                                  id: modalState.appointment.id,
                                  name:
                                      modalState.appointment.customer?.name ||
                                      '',
                                  treatment: modalState.appointment.treatments
                                      .map((t) => t.id)
                                      .join(', '),
                                  date: splitDateTimeFromISO(
                                      modalState.appointment.scheduled_start,
                                  ).date,
                                  time: splitDateTimeFromISO(
                                      modalState.appointment.scheduled_start,
                                  ).time,
                                  tipAmmount:
                                      modalState.appointment.tipAmount ?? '',
                                  products:
                                      modalState.appointment.products?.map(
                                          (p) => p.id,
                                      ) ?? [],
                              }
                            : undefined
                    }
                    onConfirm={handleConfirm}
                    onCancel={handleCancelConfirm}
                />

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

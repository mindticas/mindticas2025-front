import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import React, { useState } from 'react';
import AdminTable from '../AdminTable';
import { useTreatments } from '@/hooks/useTreatments';
import { FilePenLine, Plus, Trash } from 'lucide-react';
import TreatmentModal, {
    ModalMode,
    TreatmentModalEvent,
} from './components/TreatmentModal';
import { Treatment } from '@/interfaces/treatment/Treatment';
import {
    createTreatment,
    deleteTreatment,
    updateTreatment,
} from '@/services/TreatmentService';
import { Toaster } from '@/components/ui/toaster';
import {
    hasTreatmentChanges,
    showNoChangesToast,
} from '@/utils/treatments/treatmentValidation';
import TreatmentNotification from '@/utils/notifications';
import { useFilters } from '@/hooks/useFilters';
import { SearchFilters } from '@/components/SearchFilters';

export default function TreatmentsPage() {
    // Loading only for treatments
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalTrigger, setModalTrigger] = useState<{
        action: 'open' | 'close';
        mode?: ModalMode;
        treatment?: Treatment;
    } | null>(null);

    const { filters, handleFilterChange, handleSortChange } = useFilters({
        name: '',
        sort: '',
    });
    const { treatments, refetch, loading } = useTreatments(filters.sort);
    const filteredTreatments =
        treatments?.filter((treatment) => {
            const name = treatment.name || '';
            return name.toLowerCase().includes(filters.name.toLowerCase());
        }) || [];

    const tableColumns = [
        {
            key: 'name',
            header: 'NOMBRE',
            render: (treatment: Treatment) => (
                <Text fontWeight='medium' textAlign='left'>
                    {treatment.name}
                </Text>
            ),
            align: 'center' as const,
            width: '20%',
        },
        {
            key: 'description',
            header: 'DESCRIPCIÓN',
            render: (treatment: Treatment) => (
                <Text maxW='100%' textAlign='left'>
                    {treatment.description}
                </Text>
            ),
            align: 'center' as const,
            width: '40%',
        },
        {
            key: 'price',
            header: 'PRECIO',
            render: (treatment: Treatment) =>
                `$${treatment.price.toLocaleString('es-CO')}`,
            align: 'center' as const,
            width: '15%',
        },
        {
            key: 'duration',
            header: 'DURACIÓN',
            render: (treatment: Treatment) => `${treatment.duration} min`,
            align: 'center' as const,
            width: '15%',
        },
        {
            key: 'actions',
            header: 'ACCIONES',
            render: (treatment: Treatment) => (
                <Box display='flex' justifyContent='center' gap={2}>
                    <Tooltip
                        content='Edit treatment'
                        positioning={{ placement: 'top' }}
                        key={`edit-${treatment.id}`}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => handleEditTreatment(treatment)}
                        >
                            <FilePenLine strokeWidth={3} color='Blue' />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Delete treatment'
                        positioning={{ placement: 'top' }}
                        key={`delete-${treatment.id}`}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => handleDeleteTreatment(treatment)}
                        >
                            <Trash strokeWidth={3} color='Red' />
                        </Button>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    async function handleCreateTreatment(
        treatmentData?: Omit<Treatment, 'id'>,
    ) {
        if (!treatmentData) return;
        setIsSubmitting(true);
        try {
            await createTreatment(treatmentData);
            // show succes message to user
            TreatmentNotification.createSuccess();
            await refetch();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Error al crear el tratamiento';
            // Show error message to user
            TreatmentNotification.createError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUpdateTreatment(
        treatmentData: Omit<Treatment, 'id'>,
        treatmentId: string | number,
    ) {
        const originalTreatment = treatments?.find((t) => t.id === treatmentId);
        if (!originalTreatment) return;
        // Check if there are changes to update
        if (!hasTreatmentChanges(originalTreatment, treatmentData)) {
            showNoChangesToast();
            return;
        }
        setIsSubmitting(true);
        try {
            await updateTreatment(
                treatmentId.toString(),
                treatmentData as Partial<Treatment>,
            );
            TreatmentNotification.updateSuccess();
            await refetch();
        } catch (error) {
            console.error('Error al actualizar el tratamiento', error);
            const errorMessage =
                error instanceof Error ? error.message : 'undefined';
            TreatmentNotification.updateError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleConfirmDelete(treatmentId: string | number) {
        setIsSubmitting(true);
        try {
            await deleteTreatment(treatmentId);
            TreatmentNotification.deleteSuccess();
            await refetch();
        } catch (error) {
            console.error('Error al eliminar el tratamiento', error);
            TreatmentNotification.deleteError();
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleEditTreatment(treatment: Treatment) {
        setModalTrigger({
            action: 'open',
            mode: 'edit',
            treatment,
        });
    }

    function handleAddTreatment() {
        if (!treatments) return;
        setModalTrigger({
            action: 'open',
            mode: 'create',
        });
    }
    function handleDeleteTreatment(treatment: Treatment) {
        setModalTrigger({
            action: 'open',
            mode: 'delete',
            treatment,
        });
    }

    const eventHandlers = {
        create: async (event: TreatmentModalEvent & { type: 'create' }) => {
            if (event.treatment) {
                await handleCreateTreatment(event.treatment);
            }
        },
        update: async (event: TreatmentModalEvent & { type: 'update' }) => {
            if (event.treatment && event.treatmentId) {
                await handleUpdateTreatment(event.treatment, event.treatmentId);
            }
        },
        delete: async (event: TreatmentModalEvent & { type: 'delete' }) => {
            if (event.treatmentId) {
                await handleConfirmDelete(event.treatmentId);
            }
        },
        cancel: async () => {},
    };

    async function handleModalEvent(event: TreatmentModalEvent): Promise<void> {
        const handler = eventHandlers[event.type];
        await handler(event as never);
    }

    return (
        <>
            <Box
                p={isSmallScreen ? 3 : 8}
                m={isSmallScreen ? 3 : 8}
                bg='white'
                borderRadius='lg'
                className='light'
            >
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={6}
                >
                    <Text fontSize='2xl' fontWeight='bold'>
                        Tratamientos
                    </Text>
                    <Button
                        _hover={{ bg: 'blue.500' }}
                        p={2}
                        size='lg'
                        fontWeight='bold'
                        colorPalette='blue'
                        onClick={handleAddTreatment}
                    >
                        <Plus size={20} />
                        Crear Tratamiento
                    </Button>
                </Box>

                <SearchFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    showSort={true}
                />

                <AdminTable
                    data={filteredTreatments}
                    columns={tableColumns}
                    isLoading={loading}
                />
            </Box>
            <TreatmentModal
                trigger={modalTrigger || undefined}
                onEvent={handleModalEvent}
                isSubmitting={isSubmitting}
            />
            <Toaster />
        </>
    );
}

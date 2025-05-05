import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import React, { useState } from 'react';
import AdminTable from '../AdminTable';
import { useTreatments } from '@/hooks/useTreatments';
import { Pencil, Plus, Trash } from 'lucide-react';
import TreatmentModal from './components/TreatmentModal';
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
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'cancel' | 'delete';
        selectTreatment?: Treatment;
    }>({
        isOpen: false,
        mode: 'create',
    });
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
                            <Pencil strokeWidth={3} color='Blue' />
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
            setModalState({
                ...modalState,
                isOpen: false,
            });
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
        treatmentData?: Omit<Treatment, 'id'> | undefined,
    ) {
        if (!modalState.selectTreatment || !treatmentData) return;
        // Check if there are changes to update
        if (!hasTreatmentChanges(modalState.selectTreatment, treatmentData)) {
            showNoChangesToast();
            setModalState({
                ...modalState,
                isOpen: false,
            });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateTreatment(
                modalState.selectTreatment.id.toString(),
                treatmentData as Partial<Treatment>,
            );
            TreatmentNotification.updateSuccess();
            await refetch();
            setModalState({
                ...modalState,
                isOpen: false,
            });
        } catch (error) {
            console.error('Error al actualizar el tratamiento', error);
            const errorMessage =
                error instanceof Error ? error.message : 'undefined';
            TreatmentNotification.updateError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleConfirmDelete() {
        if (!modalState.selectTreatment) return;
        setIsSubmitting(true);
        try {
            await deleteTreatment(modalState.selectTreatment.id);
            TreatmentNotification.deleteSuccess();
            await refetch();
            setModalState({
                ...modalState,
                isOpen: false,
            });
        } catch (error) {
            console.error('Error al eliminar el tratamiento', error);
            TreatmentNotification.deleteError();
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleEditTreatment(treatment: Treatment) {
        setModalState({
            isOpen: true,
            mode: 'edit',
            selectTreatment: treatment,
        });
    }

    function handleAddTreatment() {
        if (!treatments) return;
        setModalState({
            isOpen: true,
            mode: 'create',
        });
    }
    function handleDeleteTreatment(treatment: Treatment) {
        setModalState({
            isOpen: true,
            mode: 'delete',
            selectTreatment: treatment,
        });
    }

    const handleOnSubmit = async (
        treatment?: Omit<Treatment, 'id'>,
    ): Promise<void> => {
        if (modalState.mode === 'delete') {
            await handleConfirmDelete();
            return;
        }
        if (modalState.mode === 'edit') {
            await handleUpdateTreatment(treatment);
            return;
        }
        await handleCreateTreatment(treatment);
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
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                mode={modalState.mode}
                selectedTreatment={modalState.selectTreatment}
                onTreatmentCreated={() => {
                    refetch();
                }}
                onSubmit={handleOnSubmit}
                isSubmitting={isSubmitting}
            />
            <Toaster />
        </>
    );
}

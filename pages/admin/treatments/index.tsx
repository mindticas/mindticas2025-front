import { Treatment } from '@/interfaces/treatment/Treatment';
import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import React, { useState } from 'react';
import AdminTable from '../AdminTable';
import { useTreatments } from '@/hooks/useTreatments';
import { Pencil, Trash } from 'lucide-react';
import TreatmentModal from './components/TreatmentModal';

export default function index() {
    const { treatments } = useTreatments();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'cancel';
        treatmenT?: Treatment;
    }>({
        isOpen: false,
        mode: 'create',
    });
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
                        content='Editar tratamiento'
                        positioning={{ placement: 'top' }}
                        key={`edit-${treatment.id}`}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => console.log(treatment.name)}
                        >
                            <Pencil strokeWidth={3} color='Blue' />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Borrar tratamiento'
                        positioning={{ placement: 'top' }}
                        key={`delete-${treatment.id}`}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => console.log(treatment.name)}
                        >
                            <Trash strokeWidth={3} color='Red' />
                        </Button>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    function addTreatment() {
        if (treatments) {
            setModalState({
                isOpen: true,
                mode: 'create',
            });
        }
        console.log('Agregar treatment');
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
                        shadow='sm'
                        _hover={{ bg: 'blue.500' }}
                        p={2}
                        backgroundColor='blue.400'
                        onClick={addTreatment}
                    >
                        Nuevo Tratamiento
                    </Button>
                </Box>
                <Box
                    borderWidth='1px'
                    borderRadius='lg'
                    overflow='hidden'
                    textAlign='center'
                >
                    <AdminTable data={treatments} columns={tableColumns} />
                </Box>
            </Box>
            <TreatmentModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
            />
        </>
    );
}

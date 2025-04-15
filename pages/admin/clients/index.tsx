import React, { useEffect, useState } from 'react';

import { Customer } from '@/interfaces/customer/Customer';
import { getCustomerById, getCustomers } from '@/services/CustomerService';
import { SearchFilters } from '@/components/SearchFilters';
import { useFilters } from '@/hooks/useFilters';
import {
    Box,
    Button,
    DataList,
    Dialog,
    Portal,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Calendar, Eye } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { CloseButton } from '@/components/ui/close-button';
import StatusBadge from '../appointments/components/ui/StatusBadge';
import { Appointment } from '@/interfaces/appointment/Appointment';
import { DateTime } from 'luxon';
import AdminTable from '../AdminTable';

export default function ClientsPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectCustomer, setselectCustomer] = useState<Customer | null>(null);
    const [appointmentsByCustomer, setAppointmentsByCustomer] = useState<
        Appointment[]
    >([]);
    const [loading, setLoading] = useState(true);
    const { filters, handleFilterChange, handleSortChange } = useFilters({
        name: '',
        sort: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCustomers(filters.sort);
                setLoading(false);
                setCustomers(data);
            } catch (error) {
                setLoading(false);
                setError(
                    'Error al cargar los clientes, por favor intenta más tarde',
                );
            }
        };
        fetchData();
    }, [filters.sort]);

    const filteredCustomers = customers.filter((customer) => {
        const name = customer.name || '';
        const phone = customer.phone || '';
        return (
            name.toLowerCase().includes(filters.name.toLowerCase()) ||
            phone.toLowerCase().includes(filters.name.toLowerCase())
        );
    });

    const handleOpenClientModal = async (id: number) => {
        const customer = await getCustomerById(id);
        setAppointmentsByCustomer(customer.appointments);

        const selectedClient = customers.find((client) => client.id === id);
        if (selectedClient) {
            setselectCustomer(selectedClient);
            setOpenModal(true);
        }
    };

    const handleCloseClientModal = () => {
        setOpenModal(false);
    };

    const tableColumns = [
        {
            key: 'name',
            header: 'NOMBRE',
            render: (client: Customer) => client.name || 'Sin nombre',
            align: 'center' as const,
        },
        {
            key: 'phone',
            header: 'TELÉFONO',
            render: (client: Customer) => client.phone || 'Sin teléfono',
            align: 'center' as const,
        },

        {
            key: 'actions',
            header: 'ACCIONES',
            render: (client: Customer) => (
                <Tooltip
                    content='Ver detalle'
                    positioning={{ placement: 'top' }}
                    key={client.id}
                >
                    <Button
                        backgroundColor='transparent'
                        onClick={() => handleOpenClientModal(client.id)}
                    >
                        <Eye strokeWidth={3} color='Blue' />
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <Box
            className='light'
            borderRadius='lg'
            p={isSmallScreen ? 4 : 8}
            m={isSmallScreen ? 4 : 8}
        >
            <Text fontSize='2xl' fontWeight='bold' mb={4}>
                Clientes
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

            <Dialog.Root
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
                                    Historial de citas - {selectCustomer?.name}
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
                                    {appointmentsByCustomer.length > 0 ? (
                                        appointmentsByCustomer.map(
                                            ({
                                                id,
                                                status,
                                                scheduled_start,
                                                treatments,
                                                user,
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
                                                            Barbero
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {user?.name ||
                                                                'Sin barbero'}
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
            </Dialog.Root>
        </Box>
    );
}

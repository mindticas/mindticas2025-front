import React, { useEffect, useState } from 'react';
import AdminTable from '../AdminTable';
import { User } from '@/interfaces/user/User';
import { useFilters } from '@/hooks/useFilters';
import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { getUsers } from '@/services/UserService';
import { SearchFilters } from '@/components/SearchFilters';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const { filters, handleFilterChange, handleSortChange } = useFilters({
        name: '',
        sort: '',
    });
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUsers(filters.sort);
                setLoading(false);
                setUsers(data);
            } catch (error) {
                setLoading(false);
                setError(
                    'Error al cargar los clientes, por favor intenta más tarde',
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
                <Tooltip
                    content='Ver detalle'
                    positioning={{ placement: 'top' }}
                    key={user.id}
                >
                    <Button
                        backgroundColor='transparent'
                        // onClick={() => handleOpenClientModal(user.id)}
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
                Empleados
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
        </Box>
    );
}

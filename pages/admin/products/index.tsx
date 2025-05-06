import { Product } from '@/interfaces/product/Product';
import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AdminTable from '../AdminTable';
import { Eye, Plus, Trash } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { getProducts } from '@/services/ProductService';
import { Tooltip } from '@/components/ui/tooltip';

export default function Index() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const isMediumScreen = useBreakpointValue({ base: true, md: false });
    const { filters } = useFilters({
        name: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setLoading(false);
                setProducts(data);
            } catch (error) {
                setLoading(false);
                setError(
                    'Error al cargar los productos, por favor intenta más tarde',
                );
            }
        };
        fetchData();
    }, []);

    const tableColumns = [
        {
            key: 'name',
            header: 'NOMBRE',
            render: (product: Product) => product.name || 'Sin nombre',
            align: 'center' as const,
        },
        {
            key: 'description',
            header: 'DESCRIPCIÓN',
            render: (product: Product) =>
                product.description || 'Sin descripción',
            align: 'center' as const,
        },
        {
            key: 'price',
            header: 'PRECIO',
            render: (product: Product) => product.price || 'Sin precio',
            align: 'center' as const,
        },
        {
            key: 'stock',
            header: 'STOCK',
            render: (product: Product) => product.stock || 'Sin stock',
            align: 'center' as const,
        },

        {
            key: 'actions',
            header: 'ACCIONES',
            render: (product: Product) => (
                <Box display='flex' gap={2} justifyContent='center'>
                    <Tooltip
                        content='Ver detalle'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            // onClick={() => {
                            //     setSelectedproductId(product.id);
                            // }}
                        >
                            <Eye strokeWidth={3} color='Blue' />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Borrar producto'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            // onClick={() => handleOpenDeleteModal(product.id)}
                        >
                            <Trash strokeWidth={3} color='red' />
                        </Button>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const filteredCustomers = products.filter((product) => {
        const name = product.name || '';

        return [name.toLowerCase()].some((field) =>
            field.includes(filters.name.toLowerCase()),
        );
    });

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
                    Productos
                </Text>

                <Button
                    p={2}
                    fontWeight='bold'
                    size='lg'
                    colorPalette='blue'
                    // onClick={() => setOpenModalCreate(true)}
                >
                    <Plus size={20} />
                    Crear Producto
                </Button>
            </Box>

            <Box>
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
            </Box>

            <AdminTable
                isLoading={loading}
                data={filteredCustomers}
                columns={tableColumns}
            />
        </Box>
    );
}

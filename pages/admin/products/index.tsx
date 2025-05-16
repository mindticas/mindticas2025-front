import { Product } from '@/interfaces/product/Product';
import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AdminTable from '../AdminTable';
import { FilePenLine, Plus, Trash } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '@/services/ProductService';
import { Tooltip } from '@/components/ui/tooltip';
import { SearchFilters } from '@/components/SearchFilters';
import { toaster, Toaster } from '@/components/ui/toaster';
import { CreateProduct } from '@/interfaces/product/ CreateProduct';
import { UpdateProduct } from '@/interfaces/product/UpdateProduct';
import DeleteProductModal from './components/DeleteProductModal';
import CreateEditProductModal from './components/CreateEditProductModal';

export default function Index() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const isMediumScreen = useBreakpointValue({ base: true, md: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { filters, handleFilterChange } = useFilters({
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

    const handleCreate = async (productData: CreateProduct) => {
        setIsSubmitting(true);
        try {
            const newProduct = await createProduct(productData);
            setProducts((prev) => [...prev, newProduct]);
            setIsCreateEditModalOpen(false);
            toaster.create({
                type: 'success',
                title: 'Producto creado exitosamente',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                title: 'Error al crear el producto',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (productData: UpdateProduct) => {
        if (!selectedProduct) return;

        setIsSubmitting(true);
        try {
            const updatedProduct = await updateProduct(
                selectedProduct.id.toString(),
                productData,
            );
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === updatedProduct.id ? updatedProduct : p,
                ),
            );
            setSelectedProduct(null);
            setIsCreateEditModalOpen(false);
            toaster.create({
                type: 'success',
                title: 'Producto actualizado exitosamente',
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar el producto';
            toaster.create({
                type: 'error',
                title: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;

        setIsSubmitting(true);
        try {
            await deleteProduct(selectedProduct.id.toString());
            setProducts((prev) =>
                prev.filter((p) => p.id !== selectedProduct.id),
            );
            setIsDeleteModalOpen(false);
            toaster.create({
                type: 'success',
                title: 'Producto eliminado exitosamente',
            });
        } catch (error) {
            toaster.create({
                type: 'error',
                title: 'Error al eliminar el producto',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setIsCreateEditModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedProduct(null);
        setIsCreateEditModalOpen(true);
    };

    const handleFormSubmit = async (data: CreateProduct | UpdateProduct) => {
        if (!selectedProduct) {
            await handleCreate(data as CreateProduct);
        } else {
            await handleUpdate(data as UpdateProduct);
        }
    };

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
                        content='Editar producto'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => {
                                handleEditClick(product);
                            }}
                        >
                            <FilePenLine strokeWidth={3} color='Blue' />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Borrar producto'
                        positioning={{ placement: 'top' }}
                    >
                        <Button
                            backgroundColor='transparent'
                            onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteModalOpen(true);
                            }}
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
                    onClick={handleCreateClick}
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

            <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <AdminTable
                isLoading={loading}
                data={filteredCustomers}
                columns={tableColumns}
            />

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                productName={selectedProduct?.name}
                onConfirm={handleDelete}
                isLoading={isSubmitting}
            />

            <CreateEditProductModal
                isOpen={isCreateEditModalOpen}
                onClose={() => setIsCreateEditModalOpen(false)}
                product={selectedProduct}
                onSubmit={handleFormSubmit}
                isLoading={isSubmitting}
            />

            <Toaster />
        </Box>
    );
}

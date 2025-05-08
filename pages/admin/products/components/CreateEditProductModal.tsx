import { Dialog, Portal, Field, Input, Button } from '@chakra-ui/react';
import { Product } from '@/interfaces/product/Product';
import { CloseButton } from '@/components/ui/close-button';
import { useEffect, useState } from 'react';
import { UpdateProduct } from '@/interfaces/product/UpdateProduct';
import { CreateProduct } from '@/interfaces/product/ CreateProduct';
import { toaster, Toaster } from '@/components/ui/toaster';

interface CreateEditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    onSubmit: (data: CreateProduct | UpdateProduct) => Promise<void>;
    isLoading: boolean;
}

export function CreateEditProductModal({
    isOpen,
    onClose,
    product,
    onSubmit,
    isLoading,
}: CreateEditProductModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '0',
    });

    const [initialData, setInitialData] = useState(formData);

    useEffect(() => {
        if (isOpen && product) {
            const newData = {
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                stock: product.stock?.toString() || '0',
            };
            setFormData(newData);
            setInitialData(newData);
        } else if (isOpen) {
            const emptyData = {
                name: '',
                description: '',
                price: '',
                stock: '0',
            };
            setFormData(emptyData);
            setInitialData(emptyData);
        }
    }, [isOpen, product]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getChangedFields = () => {
        const changes: Partial<UpdateProduct> = {};

        if (formData.name !== initialData.name) {
            changes.name = formData.name;
        }
        if (formData.description !== initialData.description) {
            changes.description = formData.description;
        }
        if (formData.price !== initialData.price) {
            changes.price = parseFloat(formData.price);
        }
        if (formData.stock !== initialData.stock) {
            changes.stock = parseInt(formData.stock);
        }

        return changes;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (product) {
            const changedFields = getChangedFields();
            if (Object.keys(changedFields).length > 0) {
                await onSubmit(changedFields);
            } else {
                toaster.create({
                    type: 'info',
                    title: 'No se detectaron cambios para actualizar',
                    duration: 3000,
                });
                onClose();
            }
        } else {
            await onSubmit({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            });
        }
    };

    return (
        <>
            <Dialog.Root open={isOpen} placement='center'>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content p={5} backgroundColor='white'>
                            <Dialog.Header
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Dialog.Title>
                                    {product
                                        ? 'Editar Producto'
                                        : 'Crear Producto'}
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton onClick={onClose} />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <form onSubmit={handleSubmit}>
                                <Dialog.Body>
                                    <Field.Root mb={4}>
                                        <Field.Label>Nombre</Field.Label>
                                        <Input
                                            p={2}
                                            name='name'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Field.Root>
                                    <Field.Root mb={4}>
                                        <Field.Label>Descripción</Field.Label>
                                        <Input
                                            p={2}
                                            name='description'
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </Field.Root>
                                    <Field.Root mb={4}>
                                        <Field.Label>Precio</Field.Label>
                                        <Input
                                            p={2}
                                            type='number'
                                            name='price'
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Field.Root>
                                    <Field.Root mb={4}>
                                        <Field.Label>Stock</Field.Label>
                                        <Input
                                            p={2}
                                            type='number'
                                            name='stock'
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Field.Root>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Button
                                        p={2}
                                        variant='subtle'
                                        mr={3}
                                        onClick={onClose}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        p={2}
                                        type='submit'
                                        colorPalette='blue'
                                        loading={isLoading}
                                    >
                                        {product ? 'Actualizar' : 'Crear'}
                                    </Button>
                                </Dialog.Footer>
                            </form>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
            <Toaster />
        </>
    );
}

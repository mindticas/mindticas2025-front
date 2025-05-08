import { Product } from '@/interfaces/product/Product';
import { API_URL } from './apiConfig';
import Cookies from 'js-cookie';
import { UpdateProduct } from '@/interfaces/product/UpdateProduct';
import { CreateProduct } from '@/interfaces/product/ CreateProduct';

export const getProducts = async (): Promise<Product[]> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Error to get products');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Error to delete product');
        }
    } catch (error) {
        throw error;
    }
};

export const createProduct = async (
    productData: CreateProduct,
): Promise<Product> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear el producto');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (
    id: string,
    productData: UpdateProduct,
): Promise<Product> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || 'Error al actualizar el producto',
            );
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

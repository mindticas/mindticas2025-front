import { Product } from "@/interfaces/product/Product";
import { API_URL } from "./apiConfig";
import Cookies from 'js-cookie';

export const getProducts = async (): Promise<Product[]> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const response = await fetch(`${API_URL}/products`,{
            headers: {
                Authorization: `Bearer ${token}`,
              }
        });
        if (!response.ok) {
            throw new Error('Error to get products');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
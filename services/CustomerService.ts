import { Customer } from "@/interfaces/customer/Customer";
import { API_URL } from "./apiConfig";
import { SortCriteria } from "@/components/SearchFilters";

export const getCustomers = async (sort?: SortCriteria): Promise<Customer[]> => {
    try {
        const url = new URL(`${API_URL}/customer`);
        if (sort) {
            url.searchParams.append('param', sort);
        }

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los clientes');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const getCustomerById = async (customerId: number): Promise<Customer> => {
    try {
        const response = await fetch(`${API_URL}/customer/${customerId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el cliente');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
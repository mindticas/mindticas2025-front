import { SortCriteria } from "@/components/SearchFilters";
import { User } from "@/interfaces/user/User";
import { API_URL } from "./apiConfig";
import Cookies from 'js-cookie';
import { CreateUser } from "@/interfaces/user/CreateUser";

export const getUsers = async (sort?: SortCriteria): Promise<User[]> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const url = new URL(`${API_URL}/user`);

        if (sort) {
            url.searchParams.append('param', sort);
        }

        const response = await fetch(url.toString(),{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los empleados');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const getUserById = async (id: number): Promise<User> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const url = new URL(`${API_URL}/user/${id}`);
        
        const response = await fetch(url.toString(),{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el empleado');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const createUser = async (user: CreateUser): Promise<User> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const url = new URL(`${API_URL}/user`);
        
        const response = await fetch(url.toString(),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear el empleado');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (id: number): Promise<void> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const url = new URL(`${API_URL}/user/${id}`);
        
        const response = await fetch(url.toString(),{
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el empleado');
        }
    } catch (error) {
        throw error;
    }
}
import { Role } from "@/interfaces/role/Role";
import Cookies from "js-cookie";
import { API_URL } from "./apiConfig";
import { CreateRole } from "@/interfaces/role/CreateRole";

export const getRoles = async (): Promise<Role[]> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const url = new URL(`${API_URL}/role`);

        const response = await fetch(url.toString(),{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los roles');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const createRole = async (roleName: CreateRole): Promise<Role> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const url = new URL(`${API_URL}/role`);

        const response = await fetch(url.toString(),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(roleName),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear el rol');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}
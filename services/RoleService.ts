import { Role } from "@/interfaces/role/Role";
import Cookies from "js-cookie";
import { API_URL } from "./apiConfig";

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
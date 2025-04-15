import { SortCriteria } from "@/components/SearchFilters";
import { User } from "@/interfaces/user/User";
import { API_URL } from "./apiConfig";

export const getUsers = async (sort?: SortCriteria): Promise<User[]> => {
    try {
        const url = new URL(`${API_URL}/user`);
        if (sort) {
            url.searchParams.append('param', sort);
        }

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los empleados');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}
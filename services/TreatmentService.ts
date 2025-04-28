import { Treatment } from '@/interfaces/treatment/Treatment';
import { API_URL } from './apiConfig';
import Cookies from 'js-cookie';

const token = Cookies.get('AUTH_TOKEN');

export const createTreatment = async (
    treatment: Omit<Treatment, 'id'>,
): Promise<Treatment> => {
    try {
        const response = await fetch(`${API_URL}/treatment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(treatment),
        });
        if (!response.ok) {
            // show specific error message to user
            const errorResponse = await response.json();
            const errorMessage =
                errorResponse.statusCode === 409
                    ? 'El tratamiento ya existe'
                    : 'Error al crear el tratamient';
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getTreatments = async (): Promise<Treatment[]> => {
    try {
        const response = await fetch(`${API_URL}/treatment`);
        if (!response.ok) {
            throw new Error('Error to get treatments');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getTreatmentById = async (id: string): Promise<Treatment> => {
    try {
        const response = await fetch(`${API_URL}/treatment/${id}`);
        if (!response.ok) {
            throw new Error('Error to get treatment');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateTreatment = async (
    id: string,
    treatment: Partial<Treatment>,
): Promise<Treatment> => {
    try {
        if (treatment.price) {
            treatment.price = Number(treatment.price);
        }
        const response = await fetch(`${API_URL}/treatment/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(treatment),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error del servidor:', errorResponse);
            throw new Error('Error updating treatment');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteTreatment = async (id: string | number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/treatment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Error deleting treatment');
        }
    } catch (error) {
        throw error;
    }
};

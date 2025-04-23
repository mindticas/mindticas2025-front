import { Treatment } from '@/interfaces/treatment/Treatment';
import { API_URL } from './apiConfig';
import Cookies from 'js-cookie';

const token = Cookies.get('AUTH_TOKEN')

export const createTreatment = async (
    treatment: Omit<Treatment, 'id'>,
): Promise<Treatment> => {
    try {
        const response = await fetch(`${API_URL}/treatment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(treatment),
        });
        if (!response.ok) {
        throw new Error('Error to create treatment')
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
        const response = await fetch(`${API_URL}/treatment/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(treatment),
        });
        if (!response.ok) {
            throw new Error('Error updating treatment');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteTreatment = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/treatment/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error deleting treatment');
        }
    } catch (error) {
        throw error;
    }
};

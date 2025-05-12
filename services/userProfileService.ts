import { UserProfile } from '@/interfaces/userProfile/userProfile';
import { API_URL } from './apiConfig';

import Cookies from 'js-cookie';

export const getUserProfile = async (): Promise<UserProfile[]> => {
    try {
        const response = await fetch(`${API_URL}/userProfile`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error ${response.status}: ${error}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (
    data: Partial<UserProfile>,
): Promise<UserProfile> => {
    try {
        const token = Cookies.get('AUTH_TOKEN');
        const response = await fetch(`${API_URL}/userProfile/1`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error ${response.status}: ${error}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

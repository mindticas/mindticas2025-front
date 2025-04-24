import { Schedule } from '@/interfaces/schedule/Schedule';
import { API_URL } from './apiConfig';

export const getSchedule = async (): Promise<Schedule[]> => {
    try {
        const response = await fetch(`${API_URL}/schedule`);
        if (!response.ok) {
            throw new Error('Error to get schedule');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

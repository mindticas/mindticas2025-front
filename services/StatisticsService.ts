import { StatisticsData } from '@/interfaces/statistics/StatisticsData';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { API_URL } from './apiConfig';
import Cookies from 'js-cookie';

export const getStatistics = async (
    params: StatisticsData,
): Promise<StatisticsDataResponse> => {
    try {
        // Get token
        const token = Cookies.get('AUTH_TOKEN');
        if (!token) {
            throw new Error('No hay token de autenticacion disponible');
        }
        // Consult the url with the parameters
        let url = `${API_URL}/statistic?startDate=${params.startDate}&endDate=${params.endDate}`;
        // add treatment if exist
        if (params.treatment) {
            url += `&treatment=${params.treatment}`;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener las estadísticas');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error; // Rethrow the error to ensure the function always returns a value or throws
    }
};

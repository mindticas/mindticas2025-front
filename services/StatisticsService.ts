import { StatisticsData } from '@/interfaces/statistics/StatisticsData';
import { StatisticsDataResponse } from '@/interfaces/statistics/StatisticsDataResponse';
import { API_URL } from './apiConfig';
import Cookies from 'js-cookie';

const token = Cookies.get('AUTH_TOKEN');

export const getStatistics = async (
    params: StatisticsData,
    options?: { exportExcel: boolean }, // optional to export
): Promise<StatisticsDataResponse> => {
    try {
        // Get token
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

export const exportStatisticsToExcel = async (
    params: StatisticsData,
): Promise<void> => {
    try {
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }
        const url = `${API_URL}/statistic/export?startDate=${params.startDate}&endDate=${params.endDate}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Error al exportar las estadísticas');
        }
        // Force download (required even with backend headers)
        const blob = await response.blob(); // Binary Large Object
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        const contentDisposition = response.headers.get('Content-Disposition');
        // Set the filename from the response header or use a default name
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1]
            : `reporte-elegangsters-${params.startDate}-al-${params.endDate}.xlsx`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click(); // Run the dowload
        window.URL.revokeObjectURL(downloadUrl); // Cleaning
    } catch (error) {
        console.error('Error exporting statistics:', error);
        throw error;
    }
};

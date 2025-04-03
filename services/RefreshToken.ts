import { API_URL } from "./apiConfig"

export const refreshToken = async() => {
    try {
        console.log('Intentado hacer cosas')
        window.open(`${API_URL}/google-calendar/sync`, '_blank');
    } catch (error) {
    console.error('Error initiating Google Calendar authentication:', error);
    }
}

export const handleRefresh = async () => {
    try {
        await refreshToken();
    } catch (error) {
        console.log(error);
    }
};
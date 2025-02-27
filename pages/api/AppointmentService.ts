const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAppointment = async (newAppointment: any) => {
    try {
        const response = await fetch(`${API_URL}/appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAppointment),
        });
        if (!response.ok) {
            throw new Error('Error al enviar la cita');
        }
        return await response.json() // returns the response in json
}   catch(error){
    console.log('Error:', error)
    throw error;
}}
// Get appointments
export const getAppointment = async() => {
    try {
        const response = await fetch(`${API_URL}/appointment`)
        if(!response.ok){
            throw new Error('Error al obtener las citas')
    } 
        return await response.json()
    } catch (error) {
        console.log('Error', error)
        throw error
    }
}
// Delete appointments
export const deleteAppointment = async (appointmentId : string) => {
    try {
        const response = await fetch(`${API_URL}/appointment/${appointmentId}`, {
            method: 'DELETE',
        })
        if(!response.ok){
            throw new Error('Error al eliminar la cita')
        }
        return await response.json() // Return the delete confirmation
    } catch (error) {
        console.log('Error', error)
        throw error;
    }
}
// Update Appointment
export const updateAppointment = async(appointmentId : string, updatedData: any) => {
    try {
        const response = await fetch(`${API_URL}/appointment/${appointmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        if(!response.ok){
            throw new Error('Error al actualizar la cita')
        }
    } catch (error) {
        console.log('Error', error)
        throw error;
    }
}
// Get the services
export const getService = async() => {
    try {
        const response = await fetch(`${API_URL}/treatment`)
        if(!response.ok){
            throw new Error('Error al obtener los servicios')
        }
        return await response.json()
    } catch (error) {
        console.log('Error', error)
        throw error
    }
}
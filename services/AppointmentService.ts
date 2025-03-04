import { AppointmentCreate } from "@/interfaces/appointment/AppointmentCreate";
import { API_URL } from "./apiConfig";
import { Appointment } from "@/interfaces/appointment/Appointment";

export const createAppointment = async(newAppointment: AppointmentCreate): Promise<Appointment> => {
    try {
        const response = await fetch(`${API_URL}/appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAppointment),
        });
        if (!response.ok) {
            throw new Error('Error to create appointment');
        }
        return await response.json() 
}   catch(error){
    throw error;
}}

export const getAppointments = async(): Promise<Appointment[]> => {
    try {
        const response = await fetch(`${API_URL}/appointment`);
        if (!response.ok) {
            throw new Error('Error to get appointments');
        }
        return await response.json() 
}   catch(error){
    throw error;
}}
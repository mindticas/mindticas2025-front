import { AppointmentCreate } from "@/interfaces/appointment/AppointmentCreate";
import { API_URL } from "./apiConfig";
import { Appointment } from "@/interfaces/appointment/Appointment";
import { AppointmentUpdate } from "@/interfaces/appointment/AppointmentUpdate";

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
            throw new Error('Error al crear la cita');
        }
        return await response.json() 
}   catch(error){
    throw error;
}}

export const getAppointments = async(): Promise<Appointment[]> => {
    try {
        const response = await fetch(`${API_URL}/appointment`);
        if (!response.ok) {
            throw new Error('Error al obtener las citas');
        }
        return await response.json() 
}   catch(error){
    throw error;
}}

export const getAppointmentById = async(appointmentId:number): Promise<Appointment> => {
    try {
        const response = await fetch(`${API_URL}/appointment/${appointmentId}`);
        if (!response.ok) {
            throw new Error('Error al obtener la cita');
        }
        return await response.json()
}   catch(error){
    throw error;
}}

export const updateAppointment = async(appointmentId:number, updatedAppointment: AppointmentUpdate): Promise<Appointment> => {
    try {
        const response = await fetch(`${API_URL}/appointment/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAppointment),
        });
        if (!response.ok) {
            const errorData = await response.json();            
            throw new Error(errorData.message || 'Error al actualizar la cita');
        }
        return await response.json() 
}   catch(error){
    throw error;
}}
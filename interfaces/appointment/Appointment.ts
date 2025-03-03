import { CreateAppointment } from "./AppointmentCreate";

export interface Appointment extends CreateAppointment {
    id: number;         
    createdAt: string;  
    updatedAt: string;  
  }
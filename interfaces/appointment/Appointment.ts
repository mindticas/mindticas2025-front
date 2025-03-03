import { CreateAppointment } from "./AppointmentCreate";

export interface Appointment extends CreateAppointment {
    id: number;         
    created_at: string;  
    updated_at: string;  
  }
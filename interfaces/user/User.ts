import { Appointment } from "../appointment/Appointment";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    role_id: number;
    appointments: Appointment[];
}
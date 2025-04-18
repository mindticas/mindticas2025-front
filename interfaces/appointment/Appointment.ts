import { Customer } from '../customer/Customer';
import { Treatment } from '../treatment/Treatment';
import { AppointmentCreate } from './AppointmentCreate';
import { User } from './User';

export interface Appointment extends AppointmentCreate {
    id: number;
    duration: number;
    status: string;
    customer: Customer;
    user: User;
    treatments: Treatment[];
    created_at: string;
    updated_at: string;
}

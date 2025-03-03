export interface CreateAppointment {
    name: string;
    phone: string;
    scheduled_start: string;
    treatment_ids: number[];
 }
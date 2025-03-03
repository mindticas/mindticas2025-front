export interface CreateAppointment {
    name: string;
    phone: string;
    scheduledStart: string | null;
    treatment_ids: number[];
 }
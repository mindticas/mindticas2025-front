interface DateTimeParts {
    date: string; 
    time: string; 
}
// * @returns Object with (YYYY-MM-DD) y time (HH:MM)
export const splitDateTimeFromISO = (isoString: string | null | undefined): DateTimeParts => {
   if (!isoString) return { date: '', time: '' };
   
   const dateObj = new Date(isoString);
   
   if (isNaN(dateObj.getTime())) {
       return { date: '', time: '' };
   }

   // Format date (YYYY-MM-DD)
   const date = dateObj.toISOString().split('T')[0];
   
   // format time (HH:MM)
   const time = dateObj.toLocaleTimeString('es-ES', {
       hour: '2-digit',
       minute: '2-digit',
       hour12: false,
       timeZone: 'UTC'
   }).replace(/\./g, '');
   return { date, time };
};
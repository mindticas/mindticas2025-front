// Gets the name of the day according to the full calendar format
export const getDayName = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month -1, day)
    return date.toLocaleDateString('es-ES', { weekday: 'long'})
}
// Get the milliseconds in a day
export function addDays(date: Date, days: number): Date {
    const milisecondsPerDay = 24 * 60 * 60 * 1000; 
    return new Date(date.getTime() + days * milisecondsPerDay)
}
import { DateTime } from 'luxon';

interface DateTimeParts {
    date: string;
    time: string;
}

// * @returns Object with (YYYY-MM-DD) y time (HH:MM)

export const splitDateTimeFromISO = (
    isoString: string | null | undefined,
): DateTimeParts => {
    if (!isoString) return { date: '', time: '' };

    const dateObj = new Date(isoString);

    if (isNaN(dateObj.getTime())) {
        return { date: '', time: '' };
    }

    // format date (YYYY-MM-DD)
    const date = DateTime.fromJSDate(dateObj)
        .setZone('local')
        .toFormat('yyyy-MM-dd');

    // format time (HH:MM)
    const time = dateObj
        .toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .replace(/\./g, '');

    return { date, time };
};
// Extract only the date in ISO format.
export const extractDateOnly = (isoDate: string | null | undefined): string => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
};
// Check if a specific date is within the date range
export const isDateInRange = (
    dateToCheck: string | null | undefined,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
): boolean => {
    if (!dateToCheck || !startDate || !endDate) return false;
    const dateOnly = extractDateOnly(dateToCheck);
    const startOnly = extractDateOnly(startDate);
    const endOnly = extractDateOnly(endDate);

    return dateOnly >= startOnly && dateOnly <= endOnly;
};

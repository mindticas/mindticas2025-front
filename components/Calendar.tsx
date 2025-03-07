'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useBookingContext } from '@/context/BookingContext';
import { DateTime } from 'luxon';
import { getAppointments } from '@/services/AppointmentService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Available time slots
const timeSlots = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '16:00',
    '17:00',
];

// Function to check if a date is Sunday
const isSunday = (date: Date) => date.getDay() === 0;

export default function Calendar() {
    const { setDateTime, dateTime } = useBookingContext();
    const [error, setError] = useState<string | null>(null);

    // Check if the screen is small (responsive)
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });

    // State for selected date and time
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);

    // Function to get the current month in Spanish
    const getMonth = () =>
        format(selectedDate ?? new Date(), 'MMMM', { locale: es });

    // fetch booked appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();
                const bookedTimes = data.map((appointment) => {
                    return appointment.scheduled_start;
                });
                setBookedTimes(bookedTimes);
            } catch (error) {
                setError(
                    'No se pueden cargar los horarios ocupados. Inténtalo de nuevo más tarde.',
                );
            }
        };

        // if dateTime is reset to null, reset selectedDate and selectedTime
        if (!dateTime) {
            setSelectedDate(null);
            setSelectedTime(null);
        }

        fetchAppointments();
    }, [dateTime]);

    // Generate dates for the current week (13 days: 7 days before, today, and 5 days after)
    const weekDates = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Adjust to the start of the week (Sunday)

        return Array.from({ length: 13 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i); // Add consecutive days
            return date;
        });
    }, []);

    // Handle date selection
    const handleDateSelect = (date: Date) => {
        if (!isSunday(date)) {
            // Disallow selecting Sundays
            setSelectedDate(date);
            setSelectedTime(null); // Reset selected time
        }
    };

    // Handle time selection
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const [hours, minutes] = time.split(':');
            // Combine date and time in format 'YYYY-MM-DDTHH:MM:SS' with luxon
            const dateTime = DateTime.fromObject(
                {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth() + 1,
                    day: selectedDate.getDate(),
                    hour: parseInt(hours, 10),
                    minute: parseInt(minutes, 10),
                },
                { zone: 'utc' },
            );

            const isoString = dateTime.toISO();
            // Set the selected date and time in the BookingContext
            setDateTime(isoString);
        }
    };

    // Check if a date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Check if a date is in the past (before today)
    const isPastDate = (date: Date) => {
        const today = new Date();
        return date < new Date(today.setHours(0, 0, 0, 0)); // Compare with the start of the current day
    };

    // Check if a time is in the past (only applies if the selected date is today)
    const isPastTime = (time: string) => {
        if (!selectedDate || !isToday(selectedDate)) return false; // Only applies if the date is today
        const [hours, minutes] = time.split(':');
        const timeDate = new Date(selectedDate);
        timeDate.setHours(
            Number.parseInt(hours, 10),
            Number.parseInt(minutes, 10),
        ); // Combine date and time
        return timeDate < new Date(); // Compare with the current time
    };

    const bookedTimesForDate = useMemo(() => {
        if (!selectedDate) return [];

        // Format the selected date in ISO format (without time)
        const selectedDateISO = DateTime.fromJSDate(selectedDate).toISODate();

        // Filter booked appointments for the selected date
        return bookedTimes
            .filter((bookedTime) => {
                const bookedDateISO = DateTime.fromISO(bookedTime).toISODate();
                return bookedDateISO === selectedDateISO;
            })
            .map((bookedTime) =>
                DateTime.fromISO(bookedTime, {
                    zone: 'utc',
                }).toFormat('HH:mm'),
            );
    }, [selectedDate, bookedTimes]);

    const isBookedTime = (time: string) => {
        return bookedTimesForDate.includes(time);
    };

    return (
        <>
            <div>{error && <p style={{ color: 'red' }}>{error}</p>}</div>
            <Flex direction='column' align='center' mx='auto'>
                <Box
                    className='calendar-box'
                    bg='white'
                    p={isSmallScreen ? 4 : 6}
                    borderRadius='lg'
                    boxShadow='md'
                    borderWidth='1px'
                    borderColor='gray.200'
                >
                    {/* Calendar title */}
                    <Flex justifyContent='space-between' mb={4} px={2}>
                        <Heading
                            as='h2'
                            fontSize='lg'
                            fontWeight='bold'
                            color='black'
                        >
                            Selecciona el día
                        </Heading>
                        <Badge
                            style={{ textTransform: 'capitalize' }}
                            variant='solid'
                            p={2}
                            backgroundColor='black'
                            color='white'
                        >
                            {getMonth()}
                        </Badge>
                    </Flex>

                    {/* Days of the week */}
                    <Grid
                        templateColumns='repeat(7, 1fr)'
                        gap={isSmallScreen ? 1 : 2}
                        mb={2}
                    >
                        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(
                            (day) => (
                                <GridItem
                                    key={day}
                                    textAlign='center'
                                    fontWeight='medium'
                                    color='gray.500'
                                >
                                    {day}
                                </GridItem>
                            ),
                        )}
                    </Grid>

                    {/* Dates of the week */}
                    <Grid
                        templateColumns='repeat(7, 1fr)'
                        gap={isSmallScreen ? 1 : 3}
                        mb={4}
                    >
                        {weekDates.map((date) => (
                            <Button
                                key={date.toISOString()}
                                p={2}
                                borderRadius='md'
                                transition='background-color 0.2s'
                                bg={
                                    isPastDate(date) || isSunday(date)
                                        ? 'gray.200' // Past dates or Sundays
                                        : selectedDate?.toDateString() ===
                                          date.toDateString()
                                        ? 'black' // Selected date
                                        : isToday(date)
                                        ? 'gray.200' // Today
                                        : 'gray.100' // Future dates
                                }
                                color={
                                    isPastDate(date) || isSunday(date)
                                        ? 'gray.400' // Past dates or Sundays
                                        : selectedDate?.toDateString() ===
                                          date.toDateString()
                                        ? 'white' // Selected date
                                        : 'black' // Future dates or today
                                }
                                _hover={
                                    isPastDate(date) || isSunday(date)
                                        ? {} // No hover for past dates or Sundays
                                        : { bg: 'gray.200' } // Hover for future dates
                                }
                                onClick={() => handleDateSelect(date)}
                                disabled={isPastDate(date) || isSunday(date)} // Disable past dates or Sundays
                            >
                                {date.getDate()} {/* Day of the month */}
                            </Button>
                        ))}
                    </Grid>

                    {/* Time selection (only if a date is selected) */}
                    {selectedDate && (
                        <Box>
                            <Heading
                                as='h3'
                                fontSize='lg'
                                fontWeight='semibold'
                                mb={2}
                                color='black'
                            >
                                Selecciona la hora
                            </Heading>
                            <Grid templateColumns='repeat(3, 1fr)' gap={2}>
                                {timeSlots.map((time) => (
                                    <Button
                                        key={time}
                                        p={2}
                                        borderRadius='md'
                                        transition='background-color 0.2s'
                                        bg={
                                            isPastTime(time) ||
                                            isBookedTime(time)
                                                ? 'gray.200' // Past times
                                                : selectedTime === time
                                                ? 'black' // Selected time
                                                : 'gray.100' // Future times
                                        }
                                        color={
                                            isPastTime(time) ||
                                            isBookedTime(time)
                                                ? 'gray.400' // Past times
                                                : selectedTime === time
                                                ? 'white' // Selected time
                                                : 'black' // Future times
                                        }
                                        _hover={
                                            isPastTime(time) ||
                                            isBookedTime(time)
                                                ? {} // No hover for past times
                                                : { bg: 'gray.200' } // Hover for future times
                                        }
                                        onClick={
                                            () =>
                                                !isPastTime(time) &&
                                                !isBookedTime(time) &&
                                                handleTimeSelect(time) // Handle time selection
                                        }
                                        disabled={
                                            isPastTime(time) ||
                                            isBookedTime(time)
                                        } // Disable past times
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Flex>
        </>
    );
}

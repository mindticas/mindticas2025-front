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
import { useRef } from 'react';
import { Schedule } from '@/interfaces/schedule/Schedule';
import { getSchedule } from '@/services/ScheduleService';
import {
    DAYS_OF_WEEK_ES,
    DAYS_OF_WEEK_SHORT_ES,
} from '@/constants/Calendar/dates';
import { Appointment } from '@/interfaces/appointment/Appointment';

// Function to check if a date is Sunday
const isSunday = (date: Date) => date.getDay() === 0;

export default function Calendar() {
    const { setDateTime, dateTime, treatment } = useBookingContext();
    const [error, setError] = useState<string | null>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    // Check if the screen is small (responsive)
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    // State for selected date and time
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookedTimes, setBookedTimes] = useState<Appointment[]>([]);
    // New state for schedule from backend
    const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
    // Available time slots from backend
    const [availableTimeSlots, setAvailableTimeslots] = useState<string[]>([]);
    // Check if a treatment is selected
    const isTreatmentSelected = !!treatment;
    // Function to get the current month in Spanish
    const getMonth = () =>
        format(selectedDate ?? new Date(), 'MMMM', { locale: es });

    // Fetch schedule data from backend
    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const data = await getSchedule();
                setScheduleData(data);
            } catch (error) {
                setError(
                    'No se pueden cargar los horarios ocupados. Inténtalo de nuevo más tarde.',
                );
            }
        };
        fetchScheduleData();
    }, []);

    // fetch booked appointments
    useEffect(() => {
        if (treatment) {
            const fetchAppointments = async () => {
                try {
                    const data = await getAppointments();
                    setBookedTimes(data);
                } catch (error) {
                    setError(
                        'No se pueden cargar los horarios ocupados. Inténtalo de nuevo más tarde.',
                    );
                }
            };
            fetchAppointments();
        }
        // if dateTime is reset to null, reset selectedDate and selectedTime
        if (!dateTime) {
            setSelectedDate(null);
            setSelectedTime(null);
        }
    }, [treatment, dateTime]);

    useEffect(() => {
        if (selectedDate) {
            // Get day of the week
            const dayOfWeek = selectedDate.getDay();
            const dayString = DAYS_OF_WEEK_ES[dayOfWeek];
            // Find schedule for the selected day
            const daySchedule = scheduleData.find((s) => s.day === dayString);
            // If schedule exist for this day, set the time slots
            const timeslots =
                daySchedule && daySchedule.open_hours
                    ? daySchedule.open_hours
                    : [];
            setAvailableTimeslots(timeslots);
        }
    }, [selectedDate, scheduleData]);

    // Generate dates for the current week
    const weekDates = useMemo(() => {
        const today = new Date();
        const currentSunday = new Date(today);
        currentSunday.setDate(today.getDate() - today.getDay());
        currentSunday.setDate(currentSunday.getDate() - 7);

        return Array.from({ length: 28 }, (_, i) => {
            const date = new Date(currentSunday);
            date.setDate(currentSunday.getDate() + i);
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
            const dateTime = DateTime.fromObject({
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                hour: parseInt(hours, 10),
                minute: parseInt(minutes, 10),
            });

            const utcDateTime = dateTime.toUTC().toISO();
            // Set the selected date and time in the BookingContext
            setDateTime(utcDateTime);
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

    const isFutureDate = (date: Date) => {
        const today = new Date();
        const weekAfter = new Date(today);
        weekAfter.setDate(today.getDate() + 8);
        weekAfter.setHours(0, 0, 0, 0);
        return date >= weekAfter;
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

    const isBookedTime = (time: string) => {
        if (!selectedDate) return false;

        const selectedDateISO = DateTime.fromJSDate(selectedDate).toISODate();

        return bookedTimes.some((appointment) => {
            const bookedDateISO = DateTime.fromISO(
                appointment.scheduled_start,
            ).toISODate();
            const bookedStatus = appointment.status;
            const formattedTime = DateTime.fromISO(
                appointment.scheduled_start,
                {
                    zone: 'local',
                },
            ).toFormat('HH:mm');

            // only check if the booked time is in the same date and not canceled
            return (
                bookedDateISO === selectedDateISO &&
                formattedTime === time &&
                bookedStatus !== 'canceled'
            );
        });
    };

    // Scroll to the schedules when the treatment and day are selected
    useEffect(() => {
        if (selectedDate && boxRef.current) {
            boxRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [treatment, selectedDate]);

    return (
        <>
            <div>{error && <p style={{ color: 'red' }}>{error}</p>}</div>
            <Flex
                direction='column'
                align='center'
                mx='auto'
                filter={treatment ? 'auto' : 'blur(5px)'} // Blur the calendar if no treatment is selected
            >
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
                        {DAYS_OF_WEEK_SHORT_ES.map((day) => (
                            <GridItem
                                key={day}
                                textAlign='center'
                                fontWeight='medium'
                                color='gray.500'
                            >
                                {day}
                            </GridItem>
                        ))}
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
                                    isPastDate(date) ||
                                    isSunday(date) ||
                                    isFutureDate(date)
                                        ? 'gray.200' // Past dates or Sundays
                                        : selectedDate?.toDateString() ===
                                          date.toDateString()
                                        ? 'black' // Selected date
                                        : isToday(date)
                                        ? 'gray.200' // Today
                                        : 'gray.100' // Future dates
                                }
                                color={
                                    isPastDate(date) ||
                                    isSunday(date) ||
                                    isFutureDate(date)
                                        ? 'gray.400' // Past dates or Sundays
                                        : selectedDate?.toDateString() ===
                                          date.toDateString()
                                        ? 'white' // Selected date
                                        : 'black' // Future dates or today
                                }
                                _hover={
                                    isPastDate(date) ||
                                    isSunday(date) ||
                                    isFutureDate(date)
                                        ? {} // No hover for past dates or Sundays
                                        : { bg: 'gray.200' } // Hover for future dates
                                }
                                onClick={() => handleDateSelect(date)}
                                disabled={
                                    isTreatmentSelected === false ||
                                    isPastDate(date) ||
                                    isSunday(date) ||
                                    isFutureDate(date)
                                } // Disable past dates or Sundays
                            >
                                {date.getDate()} {/* Day of the month */}
                            </Button>
                        ))}
                    </Grid>

                    {/* Time selection (only if a date is selected) */}
                    {selectedDate && (
                        <Box ref={boxRef}>
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
                                {availableTimeSlots.map((time) => (
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
                                        onClick={() =>
                                            !isPastTime(time) &&
                                            !isBookedTime(time) &&
                                            handleTimeSelect(time)
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

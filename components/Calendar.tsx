'use client';
import styles from '@/styles/Calendar.module.css';

import { Box, Text } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useState } from 'react';
import AvailableSchedule from './AvailableSchedule';
import { addDays } from '@/helpers/dateHelpers';

export default function Calendar() {
    // State of the selected day
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    // Get data for the selected day
    const handleDateClick = (info: DateClickArg) => {
        setSelectedDate(info.dateStr);
    };

    return (
        <>
            <Box
                maxW='900px'
                borderRadius='md'
                mx='auto'
                mt={5}
                mb={5}
                p={4}
                className={styles.calendarWrapper}
            >
                <Text
                    fontSize='2xl'
                    mb={7}
                    fontWeight='bold'
                    textAlign='center'
                >
                    Calendario
                </Text>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView='customWeek'
                    initialDate={new Date()}
                    height='400px'
                    contentHeight={300}
                    locale={'es'}
                    headerToolbar={{
                        left: 'title',
                        center: '',
                        right: 'prev,next today',
                    }}
                    views={{
                        customWeek: {
                            type: 'dayGridWeek',
                            duration: { days: 7 },
                            visibleRange: (currentDate) => {
                                const start = new Date(currentDate);
                                // Function from dateHelpers
                                const end = addDays(start, 7);
                                // Gets the range of days to display on the calendar
                                return { start, end };
                            },
                            dateIncrement: { days: 7 },
                            buttonText: 'Semana',
                        },
                    }}
                    buttonText={{
                        today: 'Hoy',
                    }}
                    dateClick={handleDateClick}
                />
            </Box>
            <Box>
                <AvailableSchedule
                    selectedDate={selectedDate}
                    availableTimes={[]}
                ></AvailableSchedule>
            </Box>
        </>
    );
}

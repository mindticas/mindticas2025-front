import { getDayName } from '@/utils/dateHelpers';
import { Box, Button, Text, HStack } from '@chakra-ui/react';
import styles from '@/styles/Calendar.module.css';

type AvailableScheduleProps = {
    selectedDate: string | null;
    availableTimes: string[];
};

export default function AvailableSchedule({
    selectedDate,
    availableTimes,
}: AvailableScheduleProps) {
    // Fixed schedule
    const fixedSchedule = [
        '8:00 AM',
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '5:00 PM',
        '6:00 PM',
    ];
    // Get name of the day
    const dayName = selectedDate ? getDayName(selectedDate) : '';

    // Define work days
    const weekdays = [
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
    ];
    // Get the schedule according to the selected day
    const scheduleToShow =
        selectedDate && weekdays.includes(dayName)
            ? fixedSchedule
            : availableTimes;
    return (
        <Box
            p='4'
            borderWidth='2px'
            width='fit-content'
            maxW='900px'
            m='auto'
            textAlign='center'
            borderRadius='md'
        >
            <HStack>
                {selectedDate ? (
                    <>
                        <Text textAlign='center'>
                            Horario para el día {dayName}
                        </Text>
                        <Box>
                            {scheduleToShow.length > 0 ? (
                                scheduleToShow.map((time, index) => {
                                    const isDisabled = time === '10:00 AM';

                                    return (
                                        <Button
                                            key={index}
                                            className={styles.hourButton}
                                            bg={
                                                isDisabled
                                                    ? 'black'
                                                    : 'transparent'
                                            }
                                            border={
                                                isDisabled
                                                    ? '1px solid gray'
                                                    : '1px solid white'
                                            }
                                            color={
                                                isDisabled
                                                    ? 'gray.500'
                                                    : 'white'
                                            }
                                            _hover={
                                                isDisabled
                                                    ? {}
                                                    : {
                                                          bg: 'white',
                                                          color: 'black',
                                                          border: '1px solid black',
                                                      }
                                            }
                                            cursor={
                                                isDisabled
                                                    ? 'not-allowed'
                                                    : 'pointer'
                                            }
                                            disabled={isDisabled}
                                        >
                                            {time}
                                        </Button>
                                    );
                                })
                            ) : (
                                <Text>no hay horarios</Text>
                            )}
                        </Box>
                    </>
                ) : (
                    <Text fontWeight='bold' fontSize='xl'>
                        Selecciona una fecha
                    </Text>
                )}
            </HStack>
        </Box>
    );
}

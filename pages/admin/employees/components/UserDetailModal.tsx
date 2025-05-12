import React, { useEffect, useState } from 'react';
import { Dialog, Portal, Box, DataList, Text, Spinner } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { CloseButton } from '@/components/ui/close-button';
import { DateTime } from 'luxon';

import { Appointment } from '@/interfaces/appointment/Appointment';
import { getUserById } from '@/services/UserService';
import StatusBadge from '../../appointments/components/StatusBadge';

interface UserDetailModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function UserDetailModal({
    userId,
    isOpen,
    onClose,
}: UserDetailModalProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const user = await getUserById(userId);
                setAppointments(user.appointments);
                setUserName(user.name);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, isOpen]);

    return (
        <Dialog.Root scrollBehavior='inside' open={isOpen} placement='center'>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p={5} backgroundColor='white'>
                        {loading ? (
                            <Box display='flex' justifyContent='center' p={4}>
                                <Spinner size='xl' color='blue.500' />
                            </Box>
                        ) : (
                            <>
                                <Dialog.Header
                                    mb={4}
                                    display='flex'
                                    justifyContent='space-between'
                                    alignItems='center'
                                >
                                    <Dialog.Title display='flex' gap={1} px={2}>
                                        <Calendar
                                            size={26}
                                            color='blue'
                                            strokeWidth={2}
                                        />
                                        Historial de citas - {userName}
                                    </Dialog.Title>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton
                                            size='sm'
                                            color='black'
                                            onClick={onClose}
                                        />
                                    </Dialog.CloseTrigger>
                                </Dialog.Header>
                                <Dialog.Body pb='8'>
                                    <DataList.Root
                                        orientation='horizontal'
                                        p={2}
                                    >
                                        {appointments.length > 0 ? (
                                            appointments.map((appointment) => (
                                                <Box
                                                    key={appointment.id}
                                                    p={2}
                                                    border='1px solid gray'
                                                    borderRadius='md'
                                                    display='flex'
                                                    flexDirection='column'
                                                >
                                                    <DataList.Item
                                                        justifyContent='space-between'
                                                        mb={2}
                                                    >
                                                        <DataList.ItemValue>
                                                            {appointment.treatments
                                                                .map(
                                                                    (t) =>
                                                                        t.name,
                                                                )
                                                                .join(', ')}
                                                        </DataList.ItemValue>
                                                        <DataList.ItemValue justifyContent='end'>
                                                            <StatusBadge
                                                                statusValue={
                                                                    appointment.status
                                                                }
                                                            />
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item mb={2}>
                                                        <DataList.ItemLabel>
                                                            Fecha
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {DateTime.fromISO(
                                                                appointment.scheduled_start,
                                                            ).toFormat(
                                                                'dd-MM-yyyy',
                                                            )}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item mb={2}>
                                                        <DataList.ItemLabel>
                                                            Hora
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {DateTime.fromISO(
                                                                appointment.scheduled_start,
                                                            ).toFormat('HH:mm')}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>
                                                            Cliente
                                                        </DataList.ItemLabel>
                                                        <DataList.ItemValue>
                                                            {appointment
                                                                .customer
                                                                ?.name ||
                                                                'Sin cliente'}
                                                        </DataList.ItemValue>
                                                    </DataList.Item>
                                                </Box>
                                            ))
                                        ) : (
                                            <Box
                                                width='100%'
                                                textAlign='center'
                                                p={4}
                                                color='gray.500'
                                            >
                                                <Text fontSize='lg'>
                                                    Aún no ha realizado citas
                                                </Text>
                                            </Box>
                                        )}
                                    </DataList.Root>
                                </Dialog.Body>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

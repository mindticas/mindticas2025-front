'use client';

import { Box, Button } from '@chakra-ui/react';
import { FilePenLine, CircleX, CircleCheckBig } from 'lucide-react';
import { ReactNode } from 'react';
import { Tooltip } from '@/components/ui/tooltip';

interface ActionButtonConfig {
    icon: ReactNode;
    color: string;
    tooltip: string;
    disabled?: boolean;
    action: (id: number) => void;
}

interface AppointmentActionsProps {
    appointmentId: number;
    status: string;
    onEdit: (id: number) => void;
    onCancel: (id: number) => void;
    onComplete: (id: number) => void;
    customActions?: ActionButtonConfig[];
}

export default function AppointmentActions({
    appointmentId,
    status,
    onEdit,
    onCancel,
    onComplete,
    customActions = [],
}: AppointmentActionsProps) {
    const baseActions: ActionButtonConfig[] = [
        {
            icon: <FilePenLine strokeWidth={3} />,
            color: 'blue',
            tooltip: 'Editar cita',
            action: onEdit,
        },
        {
            icon: <CircleX strokeWidth={3} />,
            color: 'red',
            tooltip: 'Cancelar cita',
            disabled: status === 'canceled',
            action: onCancel,
        },
        {
            icon: <CircleCheckBig strokeWidth={3} />,
            color: 'green',
            tooltip: 'Completar cita',
            disabled: status === 'completed',
            action: onComplete,
        },
    ];

    const allActions = [...baseActions, ...customActions];

    return (
        <Box display='flex' justifyContent='center'>
            {allActions.map((action, index) => (
                <Tooltip
                    key={index}
                    content={action.tooltip}
                    positioning={{ placement: 'top' }}
                >
                    <Button
                        backgroundColor='transparent'
                        size='md'
                        color={action.color}
                        ml={index > 0 ? 2 : 0}
                        disabled={action.disabled}
                        onClick={() => action.action(appointmentId)}
                        aria-label={action.tooltip}
                    >
                        {action.icon}
                    </Button>
                </Tooltip>
            ))}
        </Box>
    );
}

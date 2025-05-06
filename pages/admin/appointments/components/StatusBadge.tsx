import { statusOptions } from '@/components/SearchFilters';
import React from 'react';
import { Badge, Box } from '@chakra-ui/react';

interface BadgeProps {
    statusValue?: string;
}

export default function StatusBadge({ statusValue }: BadgeProps) {
    const statusConfig = statusOptions.find((opt) => opt.value === statusValue);

    return (
        <Badge
            colorPalette={statusConfig?.color || 'gray'}
            borderRadius='full'
            px={2}
            py={1}
            display='flex'
            justifyContent='center'
            alignItems='center'
            gap={1}
            minWidth='100px'
        >
            {statusConfig?.icon && (
                <Box display='flex' alignItems='center'>
                    {statusConfig?.icon}
                </Box>
            )}
            <span>{statusConfig?.label}</span>
        </Badge>
    );
}

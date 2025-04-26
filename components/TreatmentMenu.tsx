'use client';

import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValueText,
} from '@/components/ui/select';

import React, { useEffect, useState } from 'react';
import { useBookingContext } from '@/context/BookingContext';
import { getTreatments } from '@/services/TreatmentService';
import { Treatment } from '@/interfaces/treatment/Treatment';
import {
    Box,
    SelectRoot,
    Spinner,
    Text,
    createListCollection,
} from '@chakra-ui/react';

export default function TreatmentMenu() {
    const { treatment, setTreatment } = useBookingContext();
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTreatments = async () => {
            setIsLoading(true);
            try {
                const data = await getTreatments();
                setTreatments(data);
            } catch (error) {
                setError(
                    'Error al cargar los tratamientos. Inténtalo de nuevo más tarde.',
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchTreatments();
    }, []);

    const handleTreatmentSelect = (selectedValue: string) => {
        const treatmentId = parseInt(selectedValue);
        const selectedTreatment = treatments.find((t) => t.id === treatmentId);
        if (selectedTreatment) {
            setTreatment(selectedTreatment);
        }
    };

    if (isLoading) {
        return (
            <Box py={4}>
                <Spinner size='lg' />
            </Box>
        );
    }

    return (
        <>
            <div >{error && <p style={{ color: 'red',padding:'10px' }}>{error}</p>}</div>
            <SelectRoot
                onValueChange={(e) => handleTreatmentSelect(e.value.toString())}
                size='lg'
                maxW='sm'
                p={3}
                collection={createListCollection({ items: treatments })}
            >
                <SelectLabel fontWeight='bold' ps='1' fontSize='lg'>
                    Servicio a realizar
                </SelectLabel>
                <SelectTrigger>
                    {treatment?.name ?? 'Servicio a realizar'}
                    <SelectValueText />
                </SelectTrigger>
                <SelectContent backgroundColor='white'>
                    {treatments.map(({ id, price, name }) => (
                        <SelectItem
                            cursor='pointer'
                            _hover={{ backgroundColor: 'gray.100' }}
                            backgroundColor='white'
                            item={id.toString()}
                            key={id}
                            p={2}
                            data-state={
                                treatment?.id === id ? 'checked' : 'unchecked'
                            }
                            // disable the treatment if the booking is already made
                        >
                            {name}
                            <Text fontWeight='bold'>{`$${price} `}</Text>
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        </>
    );
}

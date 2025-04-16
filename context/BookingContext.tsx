'use client';

import { Treatment } from '@/interfaces/treatment/Treatment';
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';

// define the context type
type BookingContextType = {
    treatment: Treatment | null;
    setTreatment: (treatment: Treatment | null) => void;
    isSuccessfullyBooked: boolean;
    setIsSuccessfullyBooked: (isSuccessfullyBooked: boolean) => void;
    dateTime: string | null;
    setDateTime: (dateTime: string | null) => void;
    personData: { name: string; lastName: string; phone: string };
    setPersonData: (personData: {
        name: string;
        lastName: string;
        phone: string;
    }) => void;
    resetBooking: () => void;
};

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Hook to use the context
export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error(
            'useBookingContext must be used within a BookingProvider',
        );
    }
    return context;
};

// context provider
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [treatment, setTreatment] = useState<Treatment | null>(null);
    const [dateTime, setDateTime] = useState<string | null>(null);
    const [isSuccessfullyBooked, setIsSuccessfullyBooked] =
        useState<boolean>(false);
    const [personData, setPersonData] = useState<{
        name: string;
        lastName: string;
        phone: string;
    }>({
        name: '',
        lastName: '',
        phone: '',
    });

    // function to reset the booking
    const resetBooking = useCallback(() => {
        setTreatment(null);
        setDateTime(null);
        setIsSuccessfullyBooked(false);
    }, []);

    // Reset the treatment when booking is successful
    useEffect(() => {
        if (isSuccessfullyBooked) {
            resetBooking();
        }
    }, [isSuccessfullyBooked, resetBooking]);

    return (
        <BookingContext.Provider
            value={{
                treatment,
                setTreatment,
                dateTime,
                setDateTime,
                personData,
                setPersonData,
                resetBooking,
                isSuccessfullyBooked,
                setIsSuccessfullyBooked,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

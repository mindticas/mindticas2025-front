import React, { createContext, useState, useContext } from 'react';

// Define el tipo de datos que se almacenarán en el contexto
type BookingContextType = {
    service: string;
    setService: (service: string) => void;
    dateTime: Date | null;
    setDateTime: (dateTime: Date | null) => void;
    personData: { name: string; lastName: string; phone: string };
    setPersonData: (personData: {
        name: string;
        lastName: string;
        phone: string;
    }) => void;
};

// Crea el contexto
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error(
            'useBookingContext must be used within a BookingProvider',
        );
    }
    return context;
};

// Proveedor del contexto
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [service, setService] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [personData, setPersonData] = useState<{
        name: string;
        lastName: string;
        phone: string;
    }>({
        name: '',
        lastName: '',
        phone: '',
    });

    return (
        <BookingContext.Provider
            value={{
                service,
                setService,
                dateTime,
                setDateTime,
                personData,
                setPersonData,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

import { Treatment } from '@/interfaces/treatment/Treatment';
import { getTreatments } from '@/services/TreatmentService';
import { useEffect, useState } from 'react';

export const useTreatments = () => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTreatments = async () => {
            setLoading(true);
            try {
                const data = await getTreatments();

                setTreatments(data);
                setError(null);
            } catch (error) {
                setError(
                    'No se pudieron cargar los tratamientos. Inténtalo de nuevo',
                );
            } finally {
                setLoading(false);
            }
        };
        fetchTreatments();
    }, []);
    return { treatments, loading, error };
};

import { Treatment } from '@/interfaces/treatment/Treatment';
import { getTreatments } from '@/services/TreatmentService';
import { useCallback, useEffect, useState } from 'react';

export const useTreatments = (sort?: string) => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTreatments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTreatments(sort);
            setTreatments(data);
            setError(null);
        } catch (error) {
            setError(
                'No se pudieron cargar los tratamientos. Inténtalo de nuevo',
            );
        } finally {
            setLoading(false);
        }
    }, [sort]);

    useEffect(() => {
        fetchTreatments();
    }, [fetchTreatments]);
    return { treatments, loading, error, refetch: fetchTreatments };
};

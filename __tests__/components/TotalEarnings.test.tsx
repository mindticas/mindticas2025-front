import { render } from '@/utils/render-test';

// Primero definimos todos los datos mock que serán usados
const MOCK_DATA = {
    statistics: {
        totalEarnings: 300,
        totalServices: 2,
        totalCompletedAppointments: 2,
        totalCanceledAppointments: 0,
    },
    dateRange: {
        startDate: '2024-05-01T00:00:00Z',
        endDate: '2024-05-10T00:00:00Z',
    },
    appointments: [
        {
            scheduled_start: '2024-05-01T10:00:00Z',
            status: 'completed',
            treatments: [{ name: 'Corte', price: '100' }],
        },
        {
            scheduled_start: '2024-05-02T11:00:00Z',
            status: 'completed',
            treatments: [{ name: 'Tinte', price: '200' }],
        },
    ],
    treatments: [
        { id: '1', name: 'Corte', price: '100' },
        { id: '2', name: 'Tinte', price: '200' },
    ],
};

// Mock de servicios usando una función factory
jest.mock('@/services/AppointmentService', () => ({
    getAppointments: jest.fn(() => Promise.resolve(MOCK_DATA.appointments)),
}));

// Mock de hooks
jest.mock('@/hooks/useTreatments', () => ({
    useTreatments: () => ({
        treatments: MOCK_DATA.treatments,
        error: null,
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('TotalEarnings Component', () => {
    it('renders correctly with statistics and date range', async () => {
        const { asFragment, findByText } = render(
            <TotalEarnings
                statistics={MOCK_DATA.statistics}
                dateRange={MOCK_DATA.dateRange}
            />,
        );

        await findByText(/ganancias por tratamiento/i);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders message when no dateRange is provided', () => {
        const { getByText } = render(
            <TotalEarnings statistics={undefined} dateRange={undefined} />,
        );

        expect(getByText(/selecciona un rango de fechas/i)).toBeInTheDocument();
    });
});

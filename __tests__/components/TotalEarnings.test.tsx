import TotalEarnings from '@/pages/admin/reports/components/TotalEarnings';
import { getAppointments } from '@/services/AppointmentService';
import { render } from '@/utils/render-test';
import { screen, waitFor } from '@testing-library/dom';

// Full module mockup
jest.mock('@/services/AppointmentService', () => ({
    getAppointments: jest.fn(),
}));
// First we define all the mock data that will be used
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
// Configure the mock with default values
beforeEach(() => {
    jest.clearAllMocks();
    (getAppointments as jest.Mock).mockResolvedValue(MOCK_DATA.appointments);
});

describe('TotalEarnings Component', () => {
    it('renders correctly with statistics and date range', async () => {
        const { asFragment } = render(
            <TotalEarnings
                statistics={MOCK_DATA.statistics}
                dateRange={MOCK_DATA.dateRange}
                treatments={[]}
            />,
        );
        // Wait for the component to fully render
        await waitFor(() => {
            expect(
                screen.getByText(/ganancias por tratamiento/i),
            ).toBeInTheDocument();
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders message when no dateRange is provided', () => {
        const { getByText } = render(
            <TotalEarnings
                statistics={undefined}
                dateRange={undefined}
                treatments={[]}
            />,
        );

        expect(getByText(/selecciona un rango de fechas/i)).toBeInTheDocument();
    });

    it('shows loading state when appointments are loading', async () => {
        // Simulate slower load
        (getAppointments as jest.Mock).mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
        );

        const { getByText } = render(
            <TotalEarnings dateRange={MOCK_DATA.dateRange} treatments={[]} />,
        );

        expect(
            getByText(/No hay datos para mostrar en el período seleccionado/i),
        ).toBeInTheDocument();
    });
});

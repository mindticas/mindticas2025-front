import { Provider } from '@/components/ui/provider';
import DateInputs from '@/pages/admin/reports/components/DateInputs';
import { render } from '@/utils/render-test';

// Mock of hooks and services
jest.mock('@/hooks/useTreatments', () => ({
    useTreatments: () => ({
        treatments: [
            { id: '1', name: 'Tratamiento 1' },
            { id: '2', name: 'Tratamiento 2' },
        ],
        error: null,
    }),
}));

jest.mock('@/services/StatisticsService', () => ({
    getStatistics: jest.fn(),
}));

describe('DateInputs component', () => {
    const mockProps = {
        onDateChange: jest.fn(),
        onStatisticsFetched: jest.fn(),
        onTreatmentSelect: jest.fn(),
        onLoadingChange: jest.fn(),
    };

    it('matches snapshot with default state', () => {
        const { asFragment } = render(
            <Provider>
                <DateInputs {...mockProps} />
            </Provider>,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with error', () => {
        // Mock con error
        jest.spyOn(
            require('@/hooks/useTreatments'),
            'useTreatments',
        ).mockImplementation(() => ({
            treatments: [],
            error: 'Error al cargar tratamientos',
        }));

        const { asFragment } = render(
            <Provider>
                <DateInputs {...mockProps} />
            </Provider>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

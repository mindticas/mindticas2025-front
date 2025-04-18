import KeyMetrics from '@/pages/admin/reports/components/KeyMetrics';
import { render } from '@/utils/render-test';

describe('KeyMetrics Snapshot', () => {
    const mockStatistics = {
        totalEarnings: 1234.56,
        totalServices: 78,
        totalCompletedAppointments: 65,
        totalCanceledAppointments: 13,
    };

    it('renders correctly with statistics data', () => {
        const { asFragment } = render(
            <KeyMetrics statistics={mockStatistics} isLoading={false} />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly while loading', () => {
        const { asFragment } = render(
            <KeyMetrics statistics={null} isLoading={true} />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

import { DollarSign } from 'lucide-react';
import { render } from '@/utils/render-test';
import StatsCard from '@/pages/admin/reports/components/StatsCard';

describe('StatsCard Snapshot', () => {
    it('renders correctly with icon and value', () => {
        const { asFragment } = render(
            <StatsCard
                title='Ganancias'
                value={1234}
                icon={DollarSign}
                color='green.500'
                isLoading={false}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders loading state correctly', () => {
        const { asFragment } = render(
            <StatsCard
                title='Ganancias'
                value={0}
                icon={DollarSign}
                color='green.500'
                isLoading={true}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly without icon or color', () => {
        const { asFragment } = render(
            <StatsCard title='Servicios' value={42} isLoading={false} />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

import Calendar from '@/components/Calendar';
import { render } from '@/utils/render-test';

describe('Calendar Snapsshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<Calendar />);
        expect(asFragment()).toMatchSnapshot();
    });
});

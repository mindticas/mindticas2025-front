import Footer from '@/components/Footer';
import { render } from '@/utils/render-test';

describe('Calendar Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<Footer />);
        expect(asFragment()).toMatchSnapshot();
    });
});

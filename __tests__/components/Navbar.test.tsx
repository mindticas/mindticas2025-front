import Navbar from '@/components/Navbar';
import { render } from '@/utils/render-test';

describe('Calendar Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<Navbar />);
        expect(asFragment()).toMatchSnapshot();
    });
});

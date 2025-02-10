import HomePage from '@/pages/index';
import { render } from '../../utils/render-test';

describe('HomePage Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<HomePage />);
        expect(asFragment()).toMatchSnapshot();
    });
});

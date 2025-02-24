import { render } from '../../utils/render-test';
import ServiceMenu from '@/components/ServiceMenu';

describe('HomePage Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<ServiceMenu />);
        expect(asFragment()).toMatchSnapshot();
    });
});

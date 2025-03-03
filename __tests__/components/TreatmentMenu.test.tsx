import TreatmentMenu from '@/components/TreatmentMenu';
import { render } from '../../utils/render-test';

describe('HomePage Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<TreatmentMenu />);
        expect(asFragment()).toMatchSnapshot();
    });
});

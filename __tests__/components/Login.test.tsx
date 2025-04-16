import Login from '@/components/Login';
import { render } from '@/utils/render-test';

describe('Login Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<Login />);
        expect(asFragment()).toMatchSnapshot();
    });
});

import AdminNavbar from '@/pages/admin/AdminNavbar';
import { render } from '@/utils/render-test';

describe('AdminNavbar Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(<AdminNavbar />);
        expect(asFragment()).toMatchSnapshot();
    });
});

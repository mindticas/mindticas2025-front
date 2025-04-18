import AdminNavbarDesktop from '@/pages/admin/AdminNavbarDesktop';
import { navItems } from '@/utils/navItems';
import { render } from '@/utils/render-test';

describe('AdminNavbarDesktop Snapshot', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(
            <AdminNavbarDesktop navItems={navItems} pathname='/admin/citas' />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

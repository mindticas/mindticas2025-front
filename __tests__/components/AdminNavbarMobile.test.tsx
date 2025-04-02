import { render } from '../../utils/render-test';
import AdminNavbarMobile from '@/pages/admin/AdminNavbarMobile';
import { navItems } from '@/utils/navItems';

describe('AdminNavbarMobile Snapshot', () => {
    it('should match the snapshot', () => {
        const mockToggleMenu = jest.fn();
        const { asFragment } = render(
            <AdminNavbarMobile
                navItems={navItems}
                pathname='/admin/citas'
                isMobileMenuOpen={false}
                onToggleMenu={mockToggleMenu}
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

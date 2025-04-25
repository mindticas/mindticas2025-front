import UserDetailModal from '@/pages/admin/employees/components/UserDetailModal';
import { render } from '@/utils/render-test';
import React from 'react';

describe('UserDetailModal - Snapshot', () => {
    it('should match snapshot when open', async () => {
        const { asFragment } = render(
            <UserDetailModal userId={1} isOpen={true} onClose={() => {}} />,
        );

        expect(asFragment()).toMatchSnapshot();
    });
});

import CreateUserModal from '@/pages/admin/employees/components/CreateUserModal';
import { render } from '@/utils/render-test';
import React from 'react';

describe('CreateUserModal', () => {
    it('should render correctly when closed', () => {
        const { container } = render(
            <CreateUserModal
                isOpen={false}
                onClose={() => {}}
                onUserCreated={() => {}}
            />,
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should render correctly when open', () => {
        const { container } = render(
            <CreateUserModal
                isOpen={true}
                onClose={() => {}}
                onUserCreated={() => {}}
            />,
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});

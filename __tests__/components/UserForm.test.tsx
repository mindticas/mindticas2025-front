import UserForm from '@/pages/admin/employees/components/UserForm';
import { render } from '@/utils/render-test';
import React from 'react';

describe('UserForm Component', () => {
    const mockRoles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
    ];

    const mockSubmit = jest.fn();

    it('should match snapshot with default props', () => {
        const { container } = render(
            <UserForm
                roles={mockRoles}
                isLoading={false}
                onSubmit={mockSubmit}
            />,
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when loading', () => {
        const { container } = render(
            <UserForm
                roles={mockRoles}
                isLoading={true}
                onSubmit={mockSubmit}
            />,
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
        const { container } = render(
            <UserForm
                roles={mockRoles}
                isLoading={false}
                error='Test error message'
                onSubmit={mockSubmit}
            />,
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with initial values', () => {
        const { container } = render(
            <UserForm
                roles={mockRoles}
                isLoading={false}
                onSubmit={mockSubmit}
                initialValues={{
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '123456789',
                    password: 'password',
                    role: '1',
                }}
            />,
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});

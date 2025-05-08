import { CreateEditProductModal } from '@/pages/admin/products/components/CreateEditProductModal';
import { render } from '@/utils/render-test';
import React from 'react';

describe('CreateEditProductModal', () => {
    it('should match snapshot when creating a product', () => {
        const props = {
            isOpen: true,
            onClose: jest.fn(),
            onSubmit: jest.fn(),
            isLoading: false,
        };

        const { container } = render(<CreateEditProductModal {...props} />);
        expect(container).toMatchSnapshot();
    });

    it('should match snapshot when loading', () => {
        const props = {
            isOpen: true,
            onClose: jest.fn(),
            onSubmit: jest.fn(),
            isLoading: true,
        };

        const { container } = render(<CreateEditProductModal {...props} />);
        expect(container).toMatchSnapshot();
    });
});

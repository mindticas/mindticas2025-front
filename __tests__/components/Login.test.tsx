import Login from '@/components/Login';
import { render } from '@/utils/render-test';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

describe('Login Snapshot', () => {
    it('should match the snapshot', () => {
        mockRouter.push('/');
        const { asFragment } = render(<Login />);
        expect(asFragment()).toMatchSnapshot();
    });
});

import Layout from '@/components/Layout';
import { Box } from '@chakra-ui/react';

export class AdminRoute {
    // Fixed route for admin
    private static route: string = '/admin';

    // Returns the Layout component if the pathname contains '/admin', otherwise returns box
    static getLayout(pathname: string) {
        return pathname.includes(this.route) ? Layout : Box;
    }
}

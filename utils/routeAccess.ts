export const authConfigRoutes = {
    adminRoutes: {
        basePath: '/admin',
        employeeAllowedRoutes: ['/admin/appointments', '/admin/clients'],
        adminAllowedRoutes: ['/admin', '/admin/*'],
    },
    navigationRoutes: {
        admin: '/admin',
    },
};

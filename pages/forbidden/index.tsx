import { NextPage } from 'next';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import router from 'next/router';

const ForbiddenPage: NextPage = () => {
    return (
        <Box
            display={'flex'}
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100vh'
            gap={6}
        >
            <Heading>Acceso Restringido</Heading>
            <Text>No tienes permisos para acceder a esta sección</Text>
            <Button
                variant={'subtle'}
                colorPalette={'black'}
                p={2}
                onClick={() => router.push('/admin')}
            >
                Volver al inicio
            </Button>
        </Box>
    );
};

export default ForbiddenPage;

import { Box, Flex, Text, Container, Spinner } from '@chakra-ui/react';
import { useBusiness } from '@/context/BusinessContext';

export default function Navbar() {
    const { businessInfo, isLoading } = useBusiness();

    return (
        <nav>
            <Box as='nav' bg='black' color='white'>
                <Container px={6} py={3}>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify='space-between'
                        align='center'
                    >
                        <img
                            src='/logo.png'
                            width={80}
                            height={80}
                            alt='Dynamic Image'
                        />

                        {isLoading ? (
                            <Spinner size='md' color='white' />
                        ) : (
                            <Text fontSize='xl' fontWeight='bold' ml={2}>
                                {businessInfo.name}
                            </Text>
                        )}
                    </Flex>
                </Container>
            </Box>
        </nav>
    );
}

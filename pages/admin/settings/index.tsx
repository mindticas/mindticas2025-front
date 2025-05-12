import { useBreakpointValue, Box, Heading, Flex } from '@chakra-ui/react';
import { useBusiness } from '@/context/BusinessContext';
import { Toaster } from '@/components/ui/toaster';
import BusinessForm from './components/BusinessForm';

export default function Settings() {
    const isSmallScreen =
        useBreakpointValue({ base: true, md: false }) ?? false;
    const { businessInfo, setBusinessInfo, isLoading } = useBusiness();

    return (
        <>
            <Box
                p={isSmallScreen ? 3 : 8}
                m={isSmallScreen ? 3 : 8}
                bg='white'
                borderRadius='lg'
                className='light'
                shadow='md'
            >
                <Heading
                    fontSize='2xl'
                    fontWeight='bold'
                    mb={8}
                    color='gray.800'
                    textAlign='left'
                    pl={4}
                    py={2}
                >
                    Información del negocio
                </Heading>
                <Flex justifyContent='center' width='100%' mb={6}>
                    <BusinessForm
                        businessInfo={businessInfo}
                        setBusinessInfo={setBusinessInfo}
                        isSmallScreen={isSmallScreen}
                        isLoading={isLoading}
                    />
                </Flex>
            </Box>
            <Toaster />
        </>
    );
}

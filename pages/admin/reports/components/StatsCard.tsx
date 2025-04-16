import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ComponentType, SVGProps } from 'react';

interface StatsCardProps {
    title: string;
    value: number;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    color?: string;
    isLoading?: boolean;
}

const StatsCard = ({
    title,
    value,
    icon: IconComponent,
    color,
    isLoading = false,
}: StatsCardProps) => {
    const bgColor = `${color?.split('.')[0]}.50`;
    return (
        <Box
            shadow='md'
            p='4'
            w='100%'
            alignContent='center'
            textAlign='center'
            borderRadius='lg'
            bg={bgColor}
            borderLeft='8px solid'
            borderLeftColor={color}
            transition='all 0.3s'
            _hover={{
                transform: 'translateY(-5px)',
                shadow: 'lg',
            }}
            backdropFilter='blur(8px)'
        >
            <Flex justifyContent='center' mb='3'>
                <Box bg={color} p='3' borderRadius='lg' width='fit-content'>
                    {IconComponent && <IconComponent color='white' />}
                </Box>
            </Flex>
            <Text fontSize='md' fontWeight='medium' color='gray.700' mb='1'>
                {title}
            </Text>
            <Flex justifyContent='center' alignItems='center' height='36px'>
                {isLoading ? (
                    <Spinner size='lg' color={color} />
                ) : (
                    <Text fontSize='2xl' fontWeight='bold'>
                        {value}
                    </Text>
                )}
            </Flex>
        </Box>
    );
};

export default StatsCard;

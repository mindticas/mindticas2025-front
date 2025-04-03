import { AdminNavbarMobileProps } from '@/interfaces/navItems/navItems';
import { handleRefresh } from '@/services/RefreshToken';
import {
    Box,
    Flex,
    Link as ChakraLink,
    IconButton,
    Stack,
    Button,
    Text,
    Image,
} from '@chakra-ui/react';
import { LogOut, Menu, Scissors } from 'lucide-react';
import NextLink from 'next/link';
import CalendarImg from '@/public/google-calendar.png';

export default function AdminNavbarMobile({
    navItems,
    pathname,
    isMobileMenuOpen,
    onToggleMenu,
}: AdminNavbarMobileProps) {
    return (
        <Box bg='gray.800' color='white' shadow='lg'>
            <Flex
                maxW='7xl'
                mx='auto'
                px={{ base: 4, md: 6, lg: 8 }}
                h='16'
                align='center'
                justify='space-between'
            >
                {/* Logo */}
                <ChakraLink
                    as={NextLink}
                    href='/admin/citas'
                    display='flex'
                    alignItems='center'
                    _hover={{ textDecoration: 'none' }}
                    color='white'
                >
                    <Scissors size={32} />
                    <Text ml='2' fontSize='xl' fontWeight='bold'>
                        Elegangster Admin
                    </Text>
                </ChakraLink>
                <IconButton
                    aria-label='Abrir menú'
                    variant='ghost'
                    size='2xl'
                    onClick={onToggleMenu}
                >
                    <Menu color='white' />
                </IconButton>
            </Flex>
            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <Box pb='4' display={{ xl: 'none' }}>
                    <Stack px='2'>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <ChakraLink
                                    key={item.name}
                                    as={NextLink}
                                    href={item.href}
                                    px='3'
                                    py='2'
                                    rounded='md'
                                    fontSize='lg'
                                    fontWeight='medium'
                                    bg={active ? 'gray.900' : 'transparent'}
                                    _hover={{
                                        bg: 'gray.700',
                                        textDecoration: 'none',
                                    }}
                                    display='flex'
                                    alignItems='center'
                                    onClick={onToggleMenu}
                                    color='white'
                                >
                                    <Icon
                                        width={20}
                                        height={20}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {item.name}
                                </ChakraLink>
                            );
                        })}
                        <Button
                            variant='ghost'
                            px='3'
                            py='2'
                            justifyContent='flex-start'
                            fontSize='lg'
                            fontWeight='medium'
                            color='gray.300'
                            _hover={{ bg: 'gray.700', color: 'white' }}
                        >
                            <LogOut size={16} />
                            Salir
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            justifyContent='flex-start'
                            variant='ghost'
                            px='3'
                            py='2'
                            fontSize='lg'
                            fontWeight='medium'
                            color='gray.300'
                            _hover={{ bg: 'gray.700', color: 'white' }}
                        >
                            <Image
                                boxSize='25px'
                                rounded='md'
                                src={CalendarImg.src}
                            />
                            <Text fontSize='md' fontWeight='medium'>
                                Sincronizar
                            </Text>
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}

'use client';
import {
    Box,
    Button,
    Flex,
    IconButton,
    Stack,
    Text,
    Link as ChakraLink,
    useBreakpointValue,
} from '@chakra-ui/react';
import {
    BarChart,
    Calendar,
    LogOut,
    Menu,
    Scissors,
    Users,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const navItems = [
    { name: 'Citas', href: '/admin/citas', icon: Calendar },
    { name: 'Empleados', href: '/admin/empleados', icon: Users },
    { name: 'Tratamientos', href: '/admin/tratamientos', icon: Scissors },
    { name: 'Reportes', href: '/admin/reportes', icon: BarChart },
];

export default function AdminNavbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isDesktop = useBreakpointValue({ base: false, md: true });
    const handleLogout = () => {
        console.log('Logging out...');
    };

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
                {/* Logo y links */}
                <Flex align='center'>
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

                    {isDesktop && (
                        <Flex ml='10' align='center' gap='4'>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = pathname === item.href;
                                return (
                                    <ChakraLink
                                        key={item.name}
                                        as={NextLink}
                                        px='3'
                                        py='2'
                                        href={item.href}
                                        rounded='md'
                                        fontSize='md'
                                        fontWeight='medium'
                                        bg={active ? 'gray.900' : 'transparent'}
                                        _hover={{
                                            bg: 'gray.700',
                                            textDecoration: 'none',
                                        }}
                                        display='flex'
                                        alignItems='center'
                                        color='white'
                                    >
                                        <Icon
                                            size={24}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {item.name}
                                    </ChakraLink>
                                );
                            })}
                        </Flex>
                    )}
                </Flex>

                {/* Sección de botón Logout para desktop */}
                {isDesktop && (
                    <Button
                        onClick={handleLogout}
                        py='2'
                        px='4'
                        bg='red.600'
                        _hover={{ bg: 'red.700' }}
                        fontWeight='bold'
                        display='flex'
                        alignItems='center'
                        gap='5'
                    >
                        <LogOut size={32} />
                        Salir
                    </Button>
                )}

                {/* Botón para abrir menú mobile */}
                {!isDesktop && (
                    <IconButton
                        aria-label='Abrir menú'
                        variant='ghost'
                        size='2xl'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu color='white' />
                    </IconButton>
                )}
            </Flex>

            {/* Menú Mobile */}
            {!isDesktop && isMobileMenuOpen && (
                <Box pb='4' display={{ md: 'none' }}>
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
                                    fontSize='base'
                                    fontWeight='medium'
                                    bg={active ? 'gray.900' : 'transparent'}
                                    _hover={{
                                        bg: 'gray.700',
                                        textDecoration: 'none',
                                    }}
                                    display='flex'
                                    alignItems='center'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    color='white'
                                >
                                    <Icon
                                        size={20}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {item.name}
                                </ChakraLink>
                            );
                        })}
                        <Button
                            onClick={handleLogout}
                            variant='ghost'
                            justifyContent='flex-start'
                            px='3'
                            py='2'
                            fontSize='base'
                            fontWeight='medium'
                            color='gray.300'
                            _hover={{ bg: 'gray.700', color: 'white' }}
                        >
                            <LogOut size={20} />
                            Salir
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}

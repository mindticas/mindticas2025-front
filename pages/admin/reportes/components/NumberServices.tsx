import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function NumberServices() {
    const data = [
        { name: 'Cabello y barba', value: 23 },
        { name: 'Corte regular', value: 12 },
        { name: 'Exfolacion', value: 5 },
        { name: 'Ceja', value: 16 },
        { name: 'Recorte y delineado de barba', value: 25 },
        { name: 'Recortes', value: 19 },
        { name: 'P. Gangster', value: 3 },
        { name: 'P. Elegangster', value: 32 },
    ];

    return (
        <Box
            mx={['4', '8', '12', '16']}
            mt={['8', '16']}
            mb={['8', '16']}
            borderRadius='md'
            p='4'
            shadow='sm'
        >
            <Text textAlign='center' fontSize='2xl' m='6'>
                Cantidad de cada servicio
            </Text>
            <Box height='500px'>
                <ResponsiveContainer>
                    <AreaChart
                        width={500}
                        height={400}
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Area
                            type='monotone'
                            dataKey='value'
                            stroke='#8884d8'
                            fill='#8884d8'
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}

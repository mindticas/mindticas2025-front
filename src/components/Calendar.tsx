import { Box, Button } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from './ui/color-mode'

export default function Calendar() {
    const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box p="16">
      <p>The current Theme is: {colorMode} mode.</p>
      <Box h="7" />
      <Button onClick={toggleColorMode}>Change Theme</Button>
    </Box>
  )
}

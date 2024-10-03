import React from 'react'
import { Box, Button, H2, H5, Text } from '@adminjs/design-system'

import { useTranslation } from 'adminjs'
const pageHeaderHeight = 300
const pageHeaderPaddingY = 74
const pageHeaderPaddingX = 250

export const DashboardHeader: React.FC = () => {
  const { translateMessage } = useTranslation()
  return (
    <Box data-css="default-dashboard">
      <Box
        position="relative"
        overflow="hidden"
        bg="white"
        height={pageHeaderHeight}
        py={pageHeaderPaddingY}
        px={['default', 'lg', pageHeaderPaddingX]}
      >
        <Text textAlign="center" color="grey100">
          <H2 fontWeight="bold">{'Welcome to the How Do I Look admin dashboard!'}</H2>
          <Text opacity={0.8}>{translateMessage('Presented by the DALI Lab')}</Text>
        </Text>
      </Box>
    </Box>
  )
}

export const Dashboard: React.FC = () => {
  const { translateMessage, translateButton } = useTranslation()

  return (
    <Box>
      <DashboardHeader />
      <Box p="xl" bg="black" boxShadow="card"
        flex
        flexDirection="row"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <img width={300} src="https://images.squarespace-cdn.com/content/v1/551cbdc5e4b0cd11d2597487/1446928884357-B0KSE9C4NADRQ46V9P9F/DALI_whiteLogo.png?format=1500w" alt="" />
      </Box>
      
    </Box>
  )
}

export default Dashboard
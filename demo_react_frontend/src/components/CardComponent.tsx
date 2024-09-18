import React from 'react';
import {Card, Box, CardContent, Typography} from '@mui/material'

interface CardComponentProps {
    cardTitle: string;
    value: string | number;
    description: string;
}


function CardComponent({cardTitle, value, description }: CardComponentProps) {
    const card = (
        <>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="gray" gutterBottom>
              {cardTitle}
            </Typography>
            <Typography variant="h5" component="div" fontSize={50} color = "gray" marginTop={5}>
              <b>{value}</b> 
            </Typography>
            <Typography sx={{ mb: 1.5, fontSize: 13 }} color="gray">
            {description}
            </Typography>
          </CardContent>
        </>
      );
    return (
        <Box sx={{ minWidth: 250, backgroundColor: 'white', borderRadius: 5, marginTop: -2 }}>
        <Card variant="outlined" sx={{height: 225, borderRadius: 5}}>{card}</Card>
      </Box>
    )
}


export default CardComponent;
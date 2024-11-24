import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

// StatCard Component for displaying stats in a card format
const StatCard = ({ title, value, color, subtitle, isPercentage = false }) => {
  // Format value as a number or percentage
  const formattedValue = isPercentage
    ? `${value.toFixed(2)}%`  // Format as percentage with two decimal places
    : value.toLocaleString(); // Format as number with commas

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader title={title} subheader={subtitle} />
      <CardContent>
        <Typography variant="h5" sx={{ color }}>
          {formattedValue}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;

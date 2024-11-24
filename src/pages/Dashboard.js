import React from 'react';
import Box from '@mui/material/Box';
import { Button, Typography, Grid, Paper, ThemeProvider, createTheme } from '@mui/material'; // Material UI components
import { useNavigate } from 'react-router-dom'; // For navigation
import { styled } from '@mui/system';

// Custom theme to make sure colors and properties are accessible
const theme = createTheme();

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Using primary dark color
    boxShadow: theme.shadows[4],
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <Box sx={{ py: 4, px: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Dashboard Header */}
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
          Dengue Data Dashboard
        </Typography>

        {/* Container for Buttons with responsive grid layout */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', textAlign: 'center' }}>
                Visualize Dengue Data on Map
              </Typography>
              <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate('/map')}
              >
                View Dengue Map
              </StyledButton>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', textAlign: 'center' }}>
                View Detailed Dengue Data
              </Typography>
              <StyledButton
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate('/data')}
              >
                View Dengue Data List
              </StyledButton>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;

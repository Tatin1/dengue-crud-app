import React from 'react';
import Box from '@mui/material/Box';
import Map from './Map';
import Typography from '@mui/material/Typography'; 
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom'; 
import { useTheme } from '@mui/material/styles';
import StatCard from '../utils/statCard';

const DengueMapPage = ({ data }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Calculate total cases, deaths, and locations
  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  const totalDeaths = data.reduce((sum, item) => sum + item.deaths, 0);
  const totalLocations = new Set(data.map(item => item.location)).size;

  // Group data by location and calculate mortality rate and case fatality ratio (CFR)
  const locationData = data.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = { totalCases: 0, totalDeaths: 0 };
    }
    acc[item.location].totalCases += item.cases;
    acc[item.location].totalDeaths += item.deaths;
    return acc;
  }, {});

  // Calculate mortality rates and CFR for each location
  const locationInsights = Object.keys(locationData).map(location => {
    const { totalCases, totalDeaths } = locationData[location];
    const mortalityRate = totalDeaths / totalCases;
    const cfr = ((totalDeaths / totalCases) * 100).toFixed(2); 

    return { location, totalCases, totalDeaths, mortalityRate, cfr };
  });

  // Sort by mortality rate and CFR
  const sortedByMortality = [...locationInsights].sort((a, b) => b.mortalityRate - a.mortalityRate);
  const sortedByCFR = [...locationInsights].sort((a, b) => b.cfr - a.cfr);

  // Get the locations with the highest and lowest mortality rate and CFR
  const highestMortality = sortedByMortality[0];
  const lowestMortality = sortedByMortality[sortedByMortality.length - 1];
  const highestCFR = sortedByCFR[0];
  const lowestCFR = sortedByCFR[sortedByCFR.length - 1];

  // Function to handle redirection to the dashboard
  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: theme.palette.mode === 'dark' ? 'white' : 'black',
        }}
      >
        Dengue Map
      </Typography>

      {/* Grid layout for the map and stat cards */}
      <Grid container spacing={2}>
        {/* Map Section */}
        {/* <Grid xs={12} sm={8}> */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box sx={{ height: '80vh', width: '100%' }}>
            <Map data={data} />
          </Box>
        </Grid>

        {/* Stat Cards Section */}
        {/* <Grid xs={12} sm={4}> */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Grid container direction="column" spacing={2}>
            {/* Group 1: General Stats */}
            <Grid xs={12} sm={6}>
              <StatCard
                title="Total Cases"
                value={totalCases}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <StatCard
                title="Total Deaths"
                value={totalDeaths}
                color={theme.palette.error.main}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <StatCard
                title="Total Locations"
                value={totalLocations}
                color={theme.palette.info.main}
              />
            </Grid>

            {/* Group 2: Mortality and CFR Stats */}
            <Grid xs={12} sm={6}>
              {highestMortality && (
                <StatCard
                  title={`Highest Mortality Rate: ${highestMortality.location}`}
                  value={highestMortality.mortalityRate.toFixed(2)}
                  color={theme.palette.warning.main}
                />
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              {lowestMortality && (
                <StatCard
                  title={`Lowest Mortality Rate: ${lowestMortality.location}`}
                  value={lowestMortality.mortalityRate.toFixed(2)}
                  color={theme.palette.success.main}
                />
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              {highestCFR && (
                <StatCard
                  title={`Highest CFR: ${highestCFR.location}`}
                  value={`${highestCFR.cfr}%`}
                  color={theme.palette.error.dark}
                />
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              {lowestCFR && (
                <StatCard
                  title={`Lowest CFR: ${lowestCFR.location}`}
                  value={`${lowestCFR.cfr}%`}
                  color={theme.palette.success.dark}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Button to navigate to the dashboard */}
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoToDashboard}
          sx={{ padding: '8px 16px' }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default DengueMapPage;

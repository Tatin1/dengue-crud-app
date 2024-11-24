import React from 'react';
import Box from '@mui/material/Box';
import DengueDataList from './DengueDataList';
import Typography from '@mui/material/Typography'; // Material UI for titles
import { Button } from '@mui/material'; // Material UI for the button
import { useNavigate } from 'react-router-dom'; // react-router-dom for navigation

const DengueDataListPage = ({ data, setData }) => {
  const navigate = useNavigate(); // Initialize the navigate hook

  // Function to handle redirection to the dashboard
  const handleGoToDashboard = () => {
    navigate('/'); // Navigates to the '/' route (Dashboard)
  };

  return (
    <Box
      sx={{
        py: 2,
        display: 'flex',
        justifyContent: 'center',  // Centers the content horizontally
        maxWidth: '1200px',  // Maximum width of the container
        margin: '0 auto',    // Centers the box within the page
        width: '100%',       // Makes the box responsive
      }}
    >
      <Box
        sx={{
          width: '100%', // Full width inside the main box
          padding: '16px', // Padding for better spacing
          backgroundColor: '#fff', // Optional: add a background color to make it stand out
          borderRadius: '8px', // Optional: rounded corners for the container
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Optional: subtle shadow for better visual appeal
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dengue Data List
        </Typography>
        <Box sx={{ maxHeight: '100vh', overflowY: 'auto', width: '100%' }}>
          <DengueDataList data={data} setData={setData} />
        </Box>

        {/* Button to navigate to the dashboard */}
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToDashboard} // Handle the button click
            sx={{ padding: '8px 16px' }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DengueDataListPage;

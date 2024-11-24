import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, IconButton, CircularProgress, Switch } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "./Sidebar";
import Dashboard from "./pages/Dashboard"; // Dashboard Component
import DengueMapPage from "./pages/DengueMapPage"; 
import DengueDataListPage from "./pages/DengueDataListPage"; 
import Papa from "papaparse";
import { db } from "./firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

// Custom theme for light mode
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue color for primary
    },
    secondary: {
      main: '#d32f2f', // Red color for secondary
    },
    background: {
      default: '#fafafa', // Light grey background
    },
  },
});

// Custom theme for dark mode
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Dark mode
    primary: {
      main: '#90caf9', // Light blue for primary
    },
    secondary: {
      main: '#f44336', // Red for secondary
    },
    background: {
      default: '#303030', // Dark background
    },
  },
});

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [useTestData] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to track theme mode

  const fetchTestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/dohdenguecases2016-2021 (1).csv');
      if (!response.ok) throw new Error("Failed to fetch CSV file");

      const text = await response.text();
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          const resultData = result.data.map((row, index) => {
            const [month, day, year] = row.date.split("/");
            const parsedDate = new Date(year, month - 1, day);
            return {
              id: index + 1,
              location: row.loc,
              cases: Number(row.cases) || 0,
              deaths: Number(row.deaths) || 0,
              date: parsedDate,
              regions: row.Region || "Unknown",
            };
          });
          setData(resultData);
        },
        error: (err) => setError(err.message),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "dengueData"));
      const fetchedData = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          date: docData.date instanceof Timestamp ? docData.date.toDate() : new Date(docData.date),
        };
      });
      setData(fetchedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (useTestData) {
      fetchTestData();
    } else {
      fetchData();
    }
  }, [useTestData, fetchTestData, fetchData]);

  if (loading) return <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  if (error) return <Box sx={{ textAlign: 'center', p: 4 }}>Error: {error}</Box>;

  // Function to toggle theme
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Router>
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: theme => theme.palette.background.default }}>
          
          {/* AppBar */}
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              width: { md: `calc(100% - ${drawerWidth}px)` }, // Adjust for larger screens
              ml: { md: `${drawerWidth}px` }, // Adjust for larger screens
            }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Icon Button for mobile view */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>

              {/* Title */}
              <Typography variant="h6" noWrap>
                Dengue Dashboard
              </Typography>

              {/* Dark Mode Toggle */}
              <Switch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                color="default"
              />
            </Toolbar>
          </AppBar>

          {/* Sidebar */}
          <SideBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isClosing={isClosing} setIsClosing={setIsClosing} />

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}> {/* Adjusted for standard AppBar height */}
            <Routes>
              {/* Pass the data to the Dashboard component */}
              <Route path="/" element={<Dashboard data={data} />} />
              <Route path="/map" element={<DengueMapPage data={data} />} />
              <Route path="/data" element={<DengueDataListPage data={data} setData={setData} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

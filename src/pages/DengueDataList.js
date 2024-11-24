import React, { useState, useMemo, useCallback } from "react";
import { Button, Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Papa from "papaparse";
import { FixedSizeList as List } from "react-window";

const DengueDataList = ({ data, setData }) => {
  const [open, setOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Sorting state
  const [sortByCases, setSortByCases] = useState("none"); // 'asc', 'desc', 'none'
  const [sortByDeaths, setSortByDeaths] = useState("none"); // 'asc', 'desc', 'none'

  // Handle dialog open/close
  const handleOpen = useCallback((item = null) => {
    setCurrentData(item);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setCurrentData(null);
    setOpen(false);
  }, []);

  // Add or Edit data
  const handleSave = useCallback(() => {
    if (currentData.id) {
      setData((prevData) =>
        prevData.map((item) => (item.id === currentData.id ? currentData : item))
      );
    } else {
      setData((prevData) => [
        ...prevData,
        { ...currentData, id: prevData.length + 1, date: new Date(currentData.date) },
      ]);
    }
    handleClose();
  }, [currentData, handleClose, setData]);

  // Delete data
  const handleDelete = useCallback(
    (id) => {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    },
    [setData]
  );

  // Handle CSV Upload
  const handleUpload = useCallback(() => {
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            const newData = result.data.map((row, index) => {
              const [month, day, year] = row.date.split("/");
              const parsedDate = new Date(year, month - 1, day);
              return {
                id: data.length + index + 1,
                location: row.loc,
                cases: Number(row.cases) || 0,
                deaths: Number(row.deaths) || 0,
                date: parsedDate,
                regions: row.Region || "Unknown",
              };
            });
            setData((prevData) => [...prevData, ...newData]);
          },
        });
      };
      reader.readAsText(csvFile);
    }
  }, [csvFile, data.length, setData]);

  // Memoize data to avoid re-renders
  const memoizedData = useMemo(() => data, [data]);

  // Calculate total cases
  const totalCases = useMemo(() => {
    return memoizedData.reduce((sum, item) => sum + item.cases, 0);
  }, [memoizedData]);

  // Calculate total number of data entries
  const totalEntries = useMemo(() => memoizedData.length, [memoizedData]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return memoizedData;
    return memoizedData.filter((item) =>
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regions.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLocaleDateString().includes(searchQuery)
    );
  }, [memoizedData, searchQuery]);

  // Sorting logic for cases and deaths
  const sortedData = useMemo(() => {
    let sorted = [...filteredData];

    if (sortByCases === "asc") {
      sorted.sort((a, b) => a.cases - b.cases);
    } else if (sortByCases === "desc") {
      sorted.sort((a, b) => b.cases - a.cases);
    }

    if (sortByDeaths === "asc") {
      sorted.sort((a, b) => a.deaths - b.deaths);
    } else if (sortByDeaths === "desc") {
      sorted.sort((a, b) => b.deaths - a.deaths);
    }

    return sorted;
  }, [filteredData, sortByCases, sortByDeaths]);

  // Render each item in the virtualized list
  const Row = ({ index, style }) => {
    const item = sortedData[index];
    return (
      <Box
        style={style}
        sx={{
          marginBottom: "12px",
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: (theme) => theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          height: "auto",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "4px", fontSize: "1rem", color: (theme) => theme.palette.text.primary }}>
          Date: {new Date(item.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "4px", color: (theme) => theme.palette.text.secondary }}>
          Cases: {item.cases}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "4px", color: (theme) => theme.palette.text.secondary }}>
          Deaths: {item.deaths}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "4px", color: (theme) => theme.palette.text.secondary }}>
          Region: {item.regions}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: (theme) => theme.palette.text.secondary }}>
          Location: {item.location}
        </Typography>

        {/* Buttons with compact styling */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "4px" }}>
          <Button variant="outlined" color="primary" onClick={() => handleOpen(item)} sx={{ padding: "4px 8px", fontSize: "0.75rem", flexShrink: 0 }}>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)} sx={{ padding: "4px 8px", fontSize: "0.75rem", flexShrink: 0 }}>
            Delete
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: "16px", backgroundColor: (theme) => theme.palette.background.default, borderRadius: "8px", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" sx={{ marginBottom: "16px", color: (theme) => theme.palette.text.primary }}>
        Dengue Data List
      </Typography>

      {/* Total Cases and Total Entries Display */}
      <Typography variant="h6" sx={{ marginBottom: "16px", color: (theme) => theme.palette.text.primary }}>
        Total Cases: {totalCases.toLocaleString()}
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "16px", color: (theme) => theme.palette.text.primary }}>
        Total Entries: {totalEntries}
      </Typography>

      <Button variant="contained" color="primary" sx={{ marginBottom: "16px", padding: "8px 16px" }} onClick={() => handleOpen()}>
        Add New Data
      </Button>

      {/* Search Input */}
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px", padding: "8px" }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "8px" }}>
        <Button
          variant="outlined"
          onClick={() => setSortByCases((prev) => (prev === "asc" ? "desc" : prev === "desc" ? "asc" : "asc"))}
        >
          Sort by Cases ({sortByCases === "asc" ? "Ascending" : sortByCases === "desc" ? "Descending" : "None"})
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSortByDeaths((prev) => (prev === "asc" ? "desc" : prev === "desc" ? "asc" : "asc"))}
        >
          Sort by Deaths ({sortByDeaths === "asc" ? "Ascending" : sortByDeaths === "desc" ? "Descending" : "None"})
        </Button>
      </Box>

      <Box sx={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
        <TextField
          type="file"
          inputProps={{ accept: ".csv" }}
          onChange={(e) => setCsvFile(e.target.files[0])}
          sx={{ marginRight: "8px", width: "180px" }}
        />
        <Button variant="contained" color="secondary" onClick={handleUpload} disabled={!csvFile} sx={{ padding: "6px 12px" }}>
          Upload CSV
        </Button>
      </Box>

      {/* Two Lists side by side */}
      <Box sx={{ display: "flex", gap: "16px" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ marginBottom: "8px", color: (theme) => theme.palette.text.primary }}>
            List 1
          </Typography>
          <List height={400} itemCount={sortedData.length} itemSize={180} width="100%">
            {Row}
          </List>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ marginBottom: "8px", color: (theme) => theme.palette.text.primary }}>
            List 2
          </Typography>
          <List height={400} itemCount={sortedData.length} itemSize={180} width="100%">
            {Row}
          </List>
        </Box>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: (theme) => theme.palette.text.primary }}>
          {currentData?.id ? "Edit Data" : "Add New Data"}
        </DialogTitle>
        <DialogContent sx={{ padding: "16px", color: (theme) => theme.palette.text.primary }}>
          {/* Your input fields for adding/editing data */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>{currentData?.id ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DengueDataList;

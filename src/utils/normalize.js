// Normalize cases or deaths by location (e.g., area, population)
export const normalizeByLocation = (locationName, value, normalize) => {
  if (!locationName || value == null) return 0; // Handle invalid input

  const normalizedLocationName = locationName.toLowerCase(); // Normalize to lowercase

  // Normalize by area (location-specific)
  if (normalize === "area_sqkm") {
    const area = getAreaForLocation(normalizedLocationName);
    if (area > 0) {
      return value / area; // Normalize by area
    } else {
      console.warn(`Area for location "${locationName}" is invalid (value: ${area}). Using default fallback.`);
    }
  }

  // Normalize by population (location-specific)
  if (normalize === "population") {
    const population = getPopulationForLocation(normalizedLocationName);
    if (population > 0) {
      return value / population; // Normalize by population
    } else {
      console.warn(`Population for location "${locationName}" is invalid (value: ${population}). Using default fallback.`);
    }
  }

  return value; // Default normalization (no normalization)
};

// Normalize cases or deaths by region (e.g., area, population)
export const normalizeByRegion = (regionName, value, normalize) => {
  if (!regionName || value == null) return 0; // Handle invalid input

  const normalizedRegionName = regionName.toLowerCase(); // Normalize to lowercase

  // Normalize by area (region-specific)
  if (normalize === "area_sqkm") {
    const area = getAreaForRegion(normalizedRegionName);
    if (area > 0) {
      return value / area; // Normalize by area
    } else {
      console.warn(`Area for region "${regionName}" is invalid (value: ${area}). Using default fallback.`);
    }
  }

  // Normalize by population (region-specific)
  if (normalize === "population") {
    const population = getPopulationForRegion(normalizedRegionName);
    if (population > 0) {
      return value / population; // Normalize by population
    } else {
      console.warn(`Population for region "${regionName}" is invalid (value: ${population}). Using default fallback.`);
    }
  }

  return value; // Default normalization (no normalization)
};

// Fetch the area for a specific location (e.g., from predefined data)
const getAreaForLocation = (locationName) => {
  if (!locationName) {
    console.warn("Location name is undefined or invalid.");
    return 1; // Default fallback for invalid location
  }

  const locationAreas = {
    location1: 100, // area in square kilometers
    location2: 200,
    pateros: 10, // Example: Pateros with area = 10 km²
    // Add more locations and their corresponding areas as needed
  };

  const area = locationAreas[locationName.toLowerCase()]; // Normalize location name to lowercase
  if (!area) {
    console.warn(`Area data for location "${locationName}" not found. Defaulting to 1.`);
    return 1; // Default area value if not found
  }
  return area;
};

// Fetch the population for a specific location (e.g., from predefined data)
const getPopulationForLocation = (locationName) => {
  if (!locationName) {
    console.warn("Location name is undefined or invalid.");
    return 1; // Default fallback for invalid location
  }

  const locationPopulations = {
    location1: 500000,
    location2: 1000000,
    pateros: 50000, // Example: Pateros with population = 50,000
    // Add more locations and their corresponding populations as needed
  };

  const population = locationPopulations[locationName.toLowerCase()]; // Normalize location name to lowercase
  if (!population) {
    console.warn(`Population data for location "${locationName}" not found. Defaulting to 1.`);
    return 1; // Default population value if not found
  }
  return population;
};

// Fetch the area for a specific region (e.g., from predefined data)
const getAreaForRegion = (regionName) => {
  if (!regionName) {
    console.warn("Region name is undefined or invalid.");
    return 1; // Default fallback for invalid region
  }

  const regionAreas = {
    region1: 1000, // area in square kilometers
    region2: 2000,
    // Add more regions and their corresponding areas as needed
  };

  const area = regionAreas[regionName.toLowerCase()]; // Normalize region name to lowercase
  if (!area) {
    console.warn(`Area data for region "${regionName}" not found. Defaulting to 1.`);
    return 1; // Default area value if not found
  }
  return area;
};

// Fetch the population for a specific region (e.g., from predefined data)
const getPopulationForRegion = (regionName) => {
  if (!regionName) {
    console.warn("Region name is undefined or invalid.");
    return 1; // Default fallback for invalid region
  }

  const regionPopulations = {
    region1: 5000000,
    region2: 10000000,
    // Add more regions and their corresponding populations as needed
  };

  const population = regionPopulations[regionName.toLowerCase()]; // Normalize region name to lowercase
  if (!population) {
    console.warn(`Population data for region "${regionName}" not found. Defaulting to 1.`);
    return 1; // Default population value if not found
  }
  return population;
};

// Get appropriate suffix for normalization based on the metric and normalization type
export const getSuffixText = (normalize, find) => {
  if (find === "fatality") {
    return "%"; // Fatality rate in percentage
  }
  if (normalize === "area_sqkm") {
    return " per km²"; // Suffix for area
  }
  if (normalize === "population") {
    return " per person"; // Suffix for population
  }
  return ""; // Default suffix (none)
};

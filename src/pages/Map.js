import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapData from "../assets/phl.json";
import locationMapping from "../assets/location_mapping.json";
import locProfiles from "../assets/loc_profiles.json";
import regionMapping from "../assets/region_mapping.json";  // Assuming you have a region_mapping.json file
import { normalizeByLocation, normalizeByRegion, getSuffixText } from "../utils/normalize";
import { toTitleCase } from "../utils/stringFuncs";

const Map = ({ data, find = "cases", by = "location", normalize = "area_sqkm" }) => {
  const [geoData, setGeoData] = useState(null);
  const [colorBreakpoints, setColorBreakpoints] = useState([]);
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const enrichedData = { ...mapData };
    enrichedData.features = enrichedData.features.map((feature) => {
      const location = locationMapping[feature.properties.name];
      const locationData = data.find((d) => d.location === location);

      let cases = 0;
      let deaths = 0;
      let fatality = 0;

      if (locationData) {
        cases = locationData.cases || 0;
        deaths = locationData.deaths || 0;
        fatality = cases > 0 ? deaths / cases : 0;

        // Handle location-specific or region-specific normalization
        if (by === "location") {
          if (find !== "fatality") {
            cases = normalizeByLocation(feature.properties.name, cases, normalize);
            deaths = normalizeByLocation(feature.properties.name, deaths, normalize);
          }
        } else {
          const region = feature.properties.region;
          if (find !== "fatality") {
            cases = normalizeByRegion(region, cases, normalize);
            deaths = normalizeByRegion(region, deaths, normalize);
          }
        }
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          cases,
          deaths,
          fatality,
        },
      };
    });

    setGeoData(enrichedData);

    const getColorBreakpoints = (geoData, find) => {
      const values = geoData.features.map((feature) => feature.properties[find]);
      values.sort((a, b) => a - b);

      const quantiles = 10;
      const breakpoints = [values[0]];

      for (let i = 1; i <= quantiles; i++) {
        const qIndex = Math.floor((i / quantiles) * values.length);
        breakpoints.push(values[qIndex]);
      }

      return breakpoints;
    };

    setColorBreakpoints(getColorBreakpoints(enrichedData, find));
    setSuffix(getSuffixText(normalize, find));
  }, [data, find, by, normalize]);

  const getColor = (value) => {
    return value > colorBreakpoints[9]
      ? "#4d0000"
      : value > colorBreakpoints[8]
      ? "#800026"
      : value > colorBreakpoints[7]
      ? "#BD0026"
      : value > colorBreakpoints[6]
      ? "#E31A1C"
      : value > colorBreakpoints[5]
      ? "#FC4E2A"
      : value > colorBreakpoints[4]
      ? "#FD8D3C"
      : value > colorBreakpoints[3]
      ? "#FEB24C"
      : value > colorBreakpoints[2]
      ? "#FED976"
      : value > colorBreakpoints[1]
      ? "#FFED80"
      : "#FFEDA0";
  };

  const style = (feature) => ({
    fillColor: getColor(feature.properties[find]),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  });

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.9,
    });
    layer.bringToFront();
  };

  const resetHighlight = (e) => {
    geoData && e.target.setStyle(style(e.target.feature));
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      // Retrieve location and region data from JSON files
      const location = locationMapping[feature.properties.name] || feature.properties.name;
      const locationData = locProfiles[location?.toLowerCase()] || {};  // Get location profile
  
      // Use toTitleCase to format the location and region names
      // const formattedLocation = location ? toTitleCase(location) : toTitleCase(feature.properties.name);
      const formattedLocation = location ? location : feature.properties.name;
  
      // Extract population, area, and region profile from locationData
      // Apply toTitleCase to region profile to ensure it's properly formatted
      const population = locationData.population 
        ? locationData.population.toLocaleString()  // Formatting population with commas for readability
        : "Data not available";
      const area = locationData.area_sqkm 
        ? `${locationData.area_sqkm.toLocaleString()} km²`  // Format area and add unit
        : "Data not available";
  
      // Apply toTitleCase to regionProfile from locationData to ensure proper display
      const regionProfile = locationData.region
        ? toTitleCase(locationData.region) 
        : "Data not available";
  
      // Format the region name using regionMapping and toTitleCase if region is available
      const formattedRegion = feature.properties.region && regionMapping[feature.properties.region]
        ? toTitleCase(regionMapping[feature.properties.region])  // Use mapping to get proper region name
        : feature.properties.region
        ? toTitleCase(feature.properties.region) 
        : "Unknown Region";  // Fallback if no region is found
  
      // Extract the COVID statistics (cases, deaths, fatality rate)
      const cases = feature.properties.cases || 0;
      const deaths = feature.properties.deaths || 0;
      const fatality = cases > 0 ? deaths / cases : 0;
  
      // Bind tooltip with properly formatted data
      layer.bindTooltip(
        `<strong>${by === "location" ? "Location" : "Region"}:</strong> ${by === "location" ? formattedLocation : formattedRegion}<br />
        <strong>Cases:</strong> ${cases.toFixed(2)}${suffix}<br />
        <strong>Deaths:</strong> ${deaths.toFixed(2)}${suffix}<br />
        <strong>Fatality Rate:</strong> ${(fatality * 100).toFixed(2)}%<br />
        <strong>Population:</strong> ${population}<br />
        <strong>Area:</strong> ${area}<br />
        <strong>Region:</strong> ${regionProfile}`,
        { sticky: true }
      );
  
      // Add interaction event handlers (highlight and reset)
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });
    }
  };
  

  return (
    <MapContainer
      center={[12.8797, 121.774]}
      zoom={6}
      style={{ height: "100%", width: "100%", minHeight: "100%", maxWidth: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {geoData && <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
};

export default Map;

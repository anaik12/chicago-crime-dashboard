import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const useCrimeData = (filePath = "/data/crime_data_2020_25.xlsx") => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Excel file...");

        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        if (workbook.SheetNames.length === 0) {
          throw new Error("No sheets found in Excel file.");
        }

        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log("Raw Excel Data:", jsonData); // Debugging

        if (!jsonData || jsonData.length === 0) {
          throw new Error("Excel file is empty or not formatted properly.");
        }

        // Use a Set to filter only top 10 categories before processing
        const categoryCounts = {};
        jsonData.forEach((row) => {
          const category = row["Primary Type"] || "Unknown";
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const topCategories = new Set(
          Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([category]) => category)
        );

        const formattedData = jsonData
          .map((row) => ({
            year: row["Year"] ? parseInt(row["Year"]) : null,
            crimeType: row["Primary Type"] || "Unknown",
            location: row["Location Description"] || "Unknown",
            latitude: row["Latitude"] ? parseFloat(row["Latitude"]) : null,
            longitude: row["Longitude"] ? parseFloat(row["Longitude"]) : null,
          }))
          // .slice(0, 50000)
          .filter((d) => topCategories.has(d.crimeType) && d.year !== null && d.latitude !== null && d.longitude !== null);

        console.log("Processed Top 10 Crime Data:", formattedData);
        setCrimeData(formattedData);
      } catch (err) {
        console.error("Error loading Excel data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filePath]);

  return { crimeData, loading, error };
};

export default useCrimeData;

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";

const MultiLineChart = ({ data }) => {
  console.log("MultiLineChart Data:", data); // Debugging

  // Declare hooks at the top before any conditionals
  const [visibleLines, setVisibleLines] = useState([]);

  // Declare useEffect at the top to ensure it's always called
  useEffect(() => {
    if (!data || data.length === 0) return; // Ensure data is available before executing

    const allCategories = [...new Set(data.map((d) => d.crimeType))];

    allCategories.forEach((category, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, category]);
      }, index * 4000); // Adjust delay time (500ms per line)
    });
  }, [data]); // Runs when `data` changes

  // Early return after hooks are declared
  if (!data || data.length === 0) return <h3>No data available for Line Chart</h3>;

  // Process data for the chart
  const yearCategoryCounts = {};
  data.forEach(({ year, crimeType }) => {
    if (!yearCategoryCounts[year]) {
      yearCategoryCounts[year] = {};
    }
    yearCategoryCounts[year][crimeType] = (yearCategoryCounts[year][crimeType] || 0) + 1;
  });

  const formattedData = Object.entries(yearCategoryCounts).map(([year, categories]) => ({
    year,
    ...categories,
  }));

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  return (
    <div>
      <h2>Crime Trends by Year (Multi-Line with Delayed Rendering)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <XAxis dataKey="year" padding={{ left: 20 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          {visibleLines.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colorScale(index)}
              strokeWidth={2}
              animationDuration={5000} // Smooth transition effect
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineChart;

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as d3 from "d3";

const StackedBarChart = ({ data }) => {
  console.log("StackedBarChart Data:", data); // Debugging

  if (!data || data.length === 0) return <h3>No data available for Bar Chart</h3>;

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

  const allCategories = [...new Set(data.map((d) => d.crimeType))];
  const colorScale = d3.scaleOrdinal(d3.schemeObservable10);

  return (
    <div>
      <h2>Crime Trends by Year (Stacked Horizontal)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={formattedData} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="year" type="category" />
          <Tooltip />
          <Legend />
          {allCategories.map((category, index) => (
            <Bar key={category} dataKey={category} stackId="a" fill={colorScale(index)} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;

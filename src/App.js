import React from "react";
import "./App.css";
// import DonutChart from "./components/DonutChart";
// import BarChartComponent from "./components/BarChart";
// import CrimeMap from "./components/CrimeMap";
import useCrimeData from "./utils/loadCrimeData";
// import StackedBarChart from "./components/StackedBarChart";
// import LineChart from "./components/LineChart";
// import MultiLineChart from "./components/MultiLineChart";

function App() {
  const { crimeData, loading, error } = useCrimeData("/data/2020-25.xlsx"); // Load from Excel

  if (loading) return <h2>Loading data...</h2>;
  if (error) return <h2>Error loading data: {error}</h2>;

  return (
    <div className="container">
      <h1>Chicago Crime Data Dashboard</h1> 
      <p>Total Records Loaded: {crimeData.length}</p>

      {/* <div className="charts-container">
        <div className="chart-item">
          <MultiLineChart data={crimeData} />
        </div>
        <div className="chart-item">
          <DonutChart data={crimeData} />
        </div>
        <div className="chart-item">
          <StackedBarChart data={crimeData} />
        </div>
        <div className="chart-item">
          <CrimeMap data={crimeData} />
        </div>
      </div>  */}
    </div>
  );
}

export default App;
